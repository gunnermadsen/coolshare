import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import { getRepoData } from '../../store/selectors/dashboard.selectors';
import { Observable, merge, of as observableOf } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { startWith, switchMap, map, catchError, delay, tap, take } from 'rxjs/operators';
import { IContents } from '@/shared/models/contents.model';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { FileUpload, CreateFolder, RetrieveFolderContents, DeleteItem, DownloadItem } from '../../store/actions/filesystem.actions';
import * as fromFileUploadActions from '@/modules/upload-file/store/actions/upload.actions.ts';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { UploadDetailsComponent } from '../upload-details/upload-details.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.less']
})
export class RepositoryComponent implements OnInit {
  public dataSource: MatTableDataSource<IContents>;
  public displayedColumns: string[] = ['select', 'name', 'createdDate', 'members', 'action'];
  public isXS: boolean = true;
  public rowSelected: boolean = false;
  public path: string[] = [];
  private cwd: string;
  private userId: string;
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) public sort: MatSort;
  public isLoadingResults = true;
  public fileList: FileList;
  public files: any[] = [];
  public selection: SelectionModel<any>;

  constructor(private store$: Store<AppState>, private breakpointObserver: BreakpointObserver, public dialog: MatDialog) {
    this.userId = JSON.parse(localStorage.getItem('Account')).Id;
    this.selection = new SelectionModel<any>(true, []);
    this.initializeTableData();
  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe((state: BreakpointState) => {
      return state.matches ? this.isXS = true : this.isXS = false;
    })

  }

  public isAllSelected() {
    if (!this.isLoadingResults) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  public setSelectionState(event: any, row: any): void {
    // event.stopPropagation();
    this.selection.toggle(row);
    if (this.selection.selected.length > 0) {
      this.rowSelected = true;
    } 
    else {
      this.rowSelected = false;
    }
  }

  public masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.rowSelected = false;
    } else {
      this.dataSource.data.forEach((row: any) => {
        return this.selection.select(row);
      });
      this.rowSelected = true;
    }    
  }

  public checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`
  }

  public initializeTableData() {
    this.store$.pipe(
      select(getRepoData),
      tap((result: any) => {
        if (result.length) {
          this.cwd = result[0].cwd;

          if (result[0].cwd != "/") {
            this.path = result[0].cwd.split('/');
            this.path.splice(0, 1);
            //this.path = result[0].cwd.split(/<br \/>(?=&#?[a-zA-Z0-9]+;)/g);
          }

        }
        return result;
      }),
      catchError((error: any) => {
        console.log(error);
        return observableOf([]);
      })
    )
    .subscribe((data: any) => {
      if (data.length) {
        this.isLoadingResults = false;

        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  public getFolderContents(row: any): void {

    if (row.type === 'File' || row.empty === true) {
      return;
    }

    //let path: string = `${row.name}`;

    const data = {
      id: this.userId,
      path: row.path
    }

    this.store$.dispatch(new RetrieveFolderContents({ folder: data }))

  }

  public navigateToNode(index: number): void {

    var dir: string;
    let path = this.path;

    if (!this.path.length) {
      return;
    }

    if (index === 0) {
      dir = '/';
      this.path = [];
    } else {
      path.splice(index, 1);
      dir = '/' + path.toString().replace(/,/g, '/')
    }

    const data = {
      id: this.userId,
      path: dir
    }

    this.store$.dispatch(new RetrieveFolderContents({ folder: data }))

  }

  public createNewFolder(): void {

    const config = new MatDialogConfig();

    config.width = '450px';

    const dialogRef = this.dialog.open(NewFolderComponent, config);

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: any) => {
      if (result.FolderName) {
        this.store$.dispatch(new CreateFolder({ id: this.userId, path: this.cwd, data: result }))
      }
    });
  }

  public showUploadDetailsDialog(): void {
    const config = new MatDialogConfig();

    config.width = '520px';
    config.height = '550px';

    config.data = {
      cwd: this.cwd,
      id: this.userId
    }

    const dialogRef = this.dialog.open(UploadDetailsComponent, config);

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: any) => {
      console.log(result);
    })
  }

  public uploadData(event: any): void {

    const clone: FileList = { ...event.target.files };

    if (clone) {

      this.store$.dispatch(new fromFileUploadActions.UploadRequestAction({
        path: this.cwd,
        id: this.userId,
        files: clone
      }));
      
      //this.isFileSet = false;
      this.files = null;
    }

  }

  public downloadItem(name: string): void {
    if (name) {
      this.store$.dispatch(new DownloadItem({ 
        path: this.cwd,
        name: name,
        id: this.userId
      }))
    }
  }


  public deleteItem(mode: number, value?: any): void {

    let items: string[] = [];

    switch(mode) {
      case 0: {
        items.push(value.name);
        break;
      }
      case 1: {
        this.selection.selected.map((item: any) => items.push(item.name));
        break;
      }
    }

    this.store$.dispatch(
      new DeleteItem({ 
        path: this.cwd, 
        items: items, 
        id: this.userId 
      })
    );

    this.selection.clear();
    this.rowSelected = false;
    
  }
  
}
 