import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import { getRepoData } from '../../store/selectors/dashboard.selectors';
import { Observable, merge, of as observableOf, throwError, Subject } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { startWith, switchMap, map, catchError, delay, tap, take, takeUntil } from 'rxjs/operators';
import { IContents } from '@/shared/models/contents.model';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { FileUpload, CreateFolder, RetrieveFolderContents, DownloadItem } from '../../store/actions/filesystem.actions';
import * as fromFileUploadActions from '@/modules/upload-file/store/actions/upload.actions.ts';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { UploadDetailsComponent } from '../upload-details/upload-details.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FileActionsComponent } from '../file-actions/file-actions.component';
import * as icons from 'pretty-file-icons';
import { HttpRepoService } from '@/core/http/repo.http.service';

import { saveAs } from 'file-saver'

import * as mime from 'mime';
import * as fileSaver from 'file-saver';


@Component({
  selector: 'repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.less']
})
export class RepositoryComponent implements OnChanges, OnInit, OnDestroy {
  public dataSource: MatTableDataSource<IContents>;
  public displayedColumns: string[] = ['select', 'name', 'createdDate', 'members', 'action'];
  public isXS: boolean = true;
  public rowSelected: boolean = false;
  public resultsLength: number;
  public path: string[] = [];
  public cwd: string;
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) public sort: MatSort;
  @ViewChild(FileActionsComponent, { static: false }) public fileActionsComponent: FileActionsComponent;
  @Input() public mode: number = 0;
  @Input() public userId: string;
  @Input() public userName: string;
  public isLoadingResults = true;
  public fileList: FileList;
  public files: any[] = [];
  public selection: SelectionModel<any>;

  private destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(private store$: Store<AppState>, private repoService: HttpRepoService, private breakpointObserver: BreakpointObserver, public dialog: MatDialog) {
    this.selection = new SelectionModel<any>(true, []);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.userId = changes.id.currentValue;
    // this.userName = changes.userName.currentValue;
  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe((state: BreakpointState) => {
      return state.matches ? this.isXS = true : this.isXS = false;
    })

    if (this.mode === 0) {
      const account = JSON.parse(localStorage.getItem('Account'));
      this.userId = account.Id;
      this.userName = account.UserName;
    }

    this.initializeTableData();
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


  // public getIcon(row: any): any {
  //   if (row.type === 'Folder') {
  //     return;
  //   }

  //   let result = row.name.split('.');
  //   const extension = result[result.length];
  //   const icon = icons.getIcon(extension);
  //   return 'svg/' + icon + '.svg';
  // }


  public initializeTableData() {
    this.store$.pipe(
      select(getRepoData),
      takeUntil(this.destroy$),
      tap((result: any) => {
        if (result.length) {
          this.cwd = result[0].cwd;
          this.path = [];

          if (result[0].cwd != "/") {
            this.path = result[0].cwd.split('/');
            this.path.splice(0, 1);
            //this.path = result[0].cwd.split(/<br \/>(?=&#?[a-zA-Z0-9]+;)/g);
          }

        }
        return result;
      }),
      catchError((error: any) => {
        return observableOf([]);
      })
    )
    .subscribe((data: any) => {
      if (data.length) {
        this.isLoadingResults = false;
        // this.resultsLength = data.length
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  public deleteItem(index: number, row: any): void {
    this.fileActionsComponent.deleteItem(index, row);
    this.rowSelected = false;
  }

  public uploadData(event: any): void {
    this.fileActionsComponent.uploadData(event);
  }

  public createNewFolder(): void {
    this.fileActionsComponent.createNewFolder();
  }

  public getFolderContents(row: any): void {

    if (row.type === 'File' || row.empty === true) {
      return;
    }

    const folder = { path: row.path, id: this.userId }

    this.store$.dispatch(new RetrieveFolderContents({ folder: folder }))

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

  public downloadItem(name: string): void {

    const params = {
      path: this.cwd,
      name: name,
      id: this.userId
    }

    this.repoService.download(params).pipe(
      catchError((error) => {
        return throwError(error)
      })
    )
    .subscribe((response: any) => {
      const type = mime.getType(name);

      let blob = new Blob([response], { type: type });

      fileSaver.saveAs(blob, name);
    })

  }

  public ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  
}
 