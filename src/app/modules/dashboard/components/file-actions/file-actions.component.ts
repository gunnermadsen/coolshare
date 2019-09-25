import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AppState } from '@/reducers';
import { Store } from '@ngrx/store';
import * as fromFileUploadActions from '@/modules/upload-file/store/actions/upload.actions.ts';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { take, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

import * as filesystem from '../../store/actions/filesystem.actions'
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { RenameEntityComponent } from '../rename-entity/rename-entity.component';
import { Update } from '@ngrx/entity';


@Component({
  selector: 'file-actions',
  templateUrl: './file-actions.component.html',
  styleUrls: ['./file-actions.component.less']
})
export class FileActionsComponent implements OnInit, OnDestroy {

  @Input() public userId: string;
  @Input() public mode: number;
  @Input() public cwd: string;
  @Input() public rowSelected: boolean;
  @Input() public selection: SelectionModel<any>;
  @Input() public userName: string;
  public isSM: boolean = false
  private destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(private store$: Store<AppState>, public dialog: MatDialog, private breakpointObserver: BreakpointObserver) {    
    this.breakpointObserver.observe(['(min-width: 475px)']).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((state: BreakpointState) => state.matches ? this.isSM = true : this.isSM = false)
  }

  ngOnInit() { }

  public uploadData(event: any): void {

    const clone: FileList = { ...event.target.files };

    if (clone) {

      this.store$.dispatch(new fromFileUploadActions.UploadRequestAction({ path: this.cwd, userId: this.userId, files: clone }));

      // this.isFileSet = false;
      // this.files = null;
    }

  }

  public refreshFiles(): void {
    this.store$.dispatch(new filesystem.RetrieveFolderContents({ folder: this.cwd, id: this.userId }))
  }


  public createNewFolder(): void {

    const config = new MatDialogConfig();

    config.width = '450px';
    
    config.data = {
      userName: this.userName
    }

    const dialogRef = this.dialog.open(NewFolderComponent, config);

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: any) => {
      if (result) {
        this.store$.dispatch(new filesystem.CreateFolder({ 
          userId: this.userId, 
          path: this.cwd, 
          data: result, 
          userName: this.userName 
        }))
      }
    });
  }

  public deleteAction(mode: number, value?: any): void {

    let entities: { name: string, path: string, type: string }[] = [];
    let ids: string[] = [];
    let id: string = ""

    switch (mode) {
      case 0: 
        entities.push({ name: value.Name, path: value.Path, type: value.Type })
        id = value.Id
      break;
      case 1: 
        this.selection.selected.map((entity: any) => {
          entities.push({ name: entity.Name, path: entity.Path, type: entity.Type })
          ids.push(entity.Id)
        })
      break;
      
    }

    const result = {
      path: this.cwd,
      entities: entities,
      userId: this.userId,
      id: id,
      ids: ids
    }

    if (mode === 0) {
      this.store$.dispatch(new filesystem.DeleteFolderItem(result));
    } 
    else {
      this.store$.dispatch(new filesystem.DeleteFolderItems(result));
    }

    this.selection.clear();
    this.rowSelected = false;

  }

  public downloadAction(name: string): void {
    this.store$.dispatch(new filesystem.DownloadItem({ path: this.cwd, name: name, userId: this.userId }));
  }

  public renameAction(entity: any): void {
    const config = new MatDialogConfig()

    config.width = '520px'
    config.height = '250px'

    config.data = {
      name: entity.Name
    }

    const dialogRef = this.dialog.open(RenameEntityComponent, config)

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: any) => {

      if (result.changes) {

        const payload: Update<any> = {
          id: entity.Id,
          changes: { Name: result.name }
        }

        const content = {
          cwd: entity.Cwd,
          userId: this.userId,
          entity: {
            id: entity.Id,
            oldName: entity.Name,
            newName: result.name,
            type: entity.Type,
            path: entity.Path
          }
        }

        this.store$.dispatch(new filesystem.RenameEntity({
          entity: payload, 
          body: content
        }))
      }

    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}
