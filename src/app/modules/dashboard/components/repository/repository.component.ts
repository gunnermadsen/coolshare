import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import { getRepoData } from '../../store/selectors/dashboard.selectors';
import { Observable, merge, of as observableOf } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { startWith, switchMap, map, catchError, delay, tap, take } from 'rxjs/operators';
import { IContents } from '@/shared/models/contents.model';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { FileUpload, CreateFolder, RetrieveFolderContents } from '../../store/actions/filesystem.actions';
import * as fromFileUploadActions from '@/modules/upload-file/store/actions/upload.actions.ts';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { UploadDetailsComponent } from '../upload-details/upload-details.component';

// import * as path from 'path';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.less']
})
export class RepositoryComponent implements OnInit {
  public dataSource: MatTableDataSource<IContents>;
  public displayedColumns: string[] = ['name', 'createdDate', 'members', 'action'];
  public isXS: boolean = true;
  public path: string[] = [];
  private cwd: string;
  private userId: string;
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) public sort: MatSort;
  public isLoadingResults = true;
  public fileList: FileList;
  public files: any[] = [];


  constructor(private store$: Store<AppState>, private breakpointObserver: BreakpointObserver, public dialog: MatDialog) {
    this.userId = JSON.parse(localStorage.getItem('Account')).Id;
    this.initializeTableData();
  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 768px']).subscribe((state: BreakpointState) => {
      return state.matches ? this.isXS = true : this.isXS = false;
    })

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
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoadingResults = false;
      return;
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
  
}
 