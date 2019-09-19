import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AppState } from '@/reducers';
import { Store } from '@ngrx/store';
import * as fromFileUploadActions from '@/modules/upload-file/store/actions/upload.actions.ts';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { take, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

import * as fromFolderActions from '../../store/actions/filesystem.actions'
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject } from 'rxjs';


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
    // this.userId = JSON.parse(localStorage.getItem('Account')).Id;
    
    this.breakpointObserver.observe(['(min-width: 475px)']).pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((state: BreakpointState) => state.matches ? this.isSM = true : this.isSM = false)
  }

  ngOnInit() {
  }

  public uploadData(event: any): void {

    const clone: FileList = { ...event.target.files };

    if (clone) {

      this.store$.dispatch(new fromFileUploadActions.UploadRequestAction({
        path: this.cwd,
        userId: this.userId,
        files: clone
      }));

      // this.isFileSet = false;
      // this.files = null;
    }

  }

  public refreshFiles(): void {
    
    const data = {
      id: this.userId,
      path: this.cwd
    }

    this.store$.dispatch(new fromFolderActions.RetrieveFolderContents({ folder: this.cwd, id: this.userId }))
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
        this.store$.dispatch(new fromFolderActions.CreateFolder({ 
          userId: this.userId, 
          path: this.cwd, 
          data: result, 
          userName: this.userName 
        }))
      }
    });
  }

  public deleteItem(mode: number, value?: any): void {

    let entities: { name: string, path: string, type: string}[] = [];
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
      this.store$.dispatch(new fromFolderActions.DeleteFolderItem(result));
    } 
    else {
      this.store$.dispatch(new fromFolderActions.DeleteFolderItems(result));
    }

    this.selection.clear();
    this.rowSelected = false;

  }

  public ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}
