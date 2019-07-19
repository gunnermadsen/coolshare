import { Component, OnInit, Input } from '@angular/core';
import { AppState } from '@/reducers';
import { Store } from '@ngrx/store';
import * as fromFileUploadActions from '@/modules/upload-file/store/actions/upload.actions.ts';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { take } from 'rxjs/operators';
import { CreateFolder, DeleteAction } from '../../store/actions/filesystem.actions';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'file-actions',
  templateUrl: './file-actions.component.html',
  styleUrls: ['./file-actions.component.less']
})
export class FileActionsComponent implements OnInit {

  @Input() public userId: string;
  @Input() public cwd: string;
  @Input() public rowSelected: boolean;
  @Input() public selection: SelectionModel<any>;
  @Input() public userName: string;

  constructor(private store$: Store<AppState>, public dialog: MatDialog) {
    // this.userId = JSON.parse(localStorage.getItem('Account')).Id;
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

      //this.isFileSet = false;
      // this.files = null;
    }

  }

  public createNewFolder(): void {

    const config = new MatDialogConfig();

    config.width = '450px';
    
    config.data = {
      userName: this.userName
    }

    const dialogRef = this.dialog.open(NewFolderComponent, config);

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: any) => {
      if (result.FolderName) {
        this.store$.dispatch(new CreateFolder({ id: this.userId, path: this.cwd, data: result, userName: this.userName }))
      }
    });
  }

  public deleteItem(mode: number, value?: any): void {

    let items: string[] = [];
    let ids: string[] = [];
    let id: string = "";

    switch (mode) {
      case 0: {
        items.push(value.name);
        id = value.id;
        break;
      }
      case 1: {
        this.selection.selected.map((item: any) => {
          items.push(item.name);
          ids.push(item.id);
        });
        break;
      }
    }

    const result = {
      path: this.cwd,
      items: items,
      userId: this.userId,
      id: id,
      ids: ids,
      mode: mode
    }

    this.store$.dispatch(
      new DeleteAction(result)
    );

    this.selection.clear();
    this.rowSelected = false;

  }

}
