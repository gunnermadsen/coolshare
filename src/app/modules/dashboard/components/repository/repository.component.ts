import { Component, OnInit, ViewChild, Input, OnDestroy, isDevMode, AfterViewInit } from '@angular/core';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { AppState } from '@/reducers';
import { getRepoData } from '../../store/selectors/dashboard.selectors';

import { Observable, of as observableOf, Subject, of } from 'rxjs';
import { catchError, tap, take, takeUntil, withLatestFrom, map, delay } from 'rxjs/operators';

import { IContents } from '@/shared/models/contents.model';

import { UploadDetailsComponent } from '../upload-details/upload-details.component';
import { FileActionsComponent } from '../file-actions/file-actions.component';

import * as filesystem from '../../store/actions/filesystem.actions'; 
import * as account from '@/modules/account/store/selectors/account.selectors';
import * as settingsSelector from '../../store/selectors/settings.selectors';
import { EntityInfoDialogComponent } from '../entity-info-dialog/entity-info-dialog.component';
import { IFile } from '@/shared/models/file.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.less']
})
export class RepositoryComponent implements OnInit, OnDestroy {
  public dataSource: MatTableDataSource<IFile>
  public repositorySearch: FormControl = new FormControl()
  public displayMode: number = 0
  public displayedColumns: string[] = []
  public isXS: boolean = true
  public rowSelected: boolean = false
  public isFolderEmpty: boolean = false
  public resultsLength: number
  public path: string[] = []
  public cwd: string
  public files$: Observable<IFile[]>
  public selectedEntity$: Observable<IFile>
  public isLoadingResults = true;
  public fileList: FileList;
  public files: IFile[] = [];
  public selection: SelectionModel<IFile>;
  private server: string;
  private destroy$: Subject<boolean> = new Subject<boolean>()
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) public sort: MatSort
  @ViewChild(FileActionsComponent, { static: false }) public fileActionsComponent: FileActionsComponent
  @Input() public mode: number = 0;
  @Input() public userId: string;
  @Input() public userName: string;

  constructor(private store$: Store<AppState>, private breakpointObserver: BreakpointObserver, public dialog: MatDialog) {
    this.selection = new SelectionModel<any>(true, []);
    this.server = isDevMode() ? 'http://localhost:4200' : 'https://coolshare.herokuapp.com'
    this.displayedColumns = [ 'select', 'name', 'action' ]
  }

  ngOnInit() {

    if (this.mode === 0) {
      const user = JSON.parse(localStorage.getItem('Account'));
      this.userId = user.Id;
      this.userName = user.UserName
    }

    this.initializeBreakpoints()

    this.initializeTableData();

    this.watchForSearch()
  }

  public getUrl(name: string, type: string): string {
    switch (type) {
      case "File": {
        const extension = name.split('.')
        return `url('${this.server}/assets/icons/${extension[extension.length - 1].toLowerCase()}.png'), 
                url('${this.server}/assets/icons/file-13.png')`
      }
      case "Folder": {
        return `url('${this.server}/assets/icons/folder-24.png')`
      }
    }
  }

  private watchForSearch(): void {
    this.repositorySearch.valueChanges.pipe(
      map((value: string) => new RegExp(value, 'gi')),
      takeUntil(this.destroy$),
    )
    .subscribe((regex: RegExp) => {
      const files = this.files.filter((file: IFile) => file.Name.match(regex))
      this.dataSource = new MatTableDataSource(files)
    })
  }

  public trackByFn<V, I>(value: V, index: I): V | I {
    return value
  }

  public isAllSelected(): boolean {
    if (!this.isLoadingResults) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  public setSelectionState(event: any, row: IFile): void {
    // event.stopPropagation();
    this.selection.toggle(row);
    if (this.selection.selected.length > 0) {
      this.rowSelected = true;
    } 
    else {
      this.rowSelected = false;
    }
  }

  private initializeBreakpoints(): void {
    this.breakpointObserver.observe(
      ['(max-width: 768px)', '(min-width: 500px)', '(max-width: 500px)']
    )
    .subscribe((state: BreakpointState) => {
      // state.matches ? this.isXS = true : this.isXS = false;
      this.isXS = state.breakpoints['(max-width: 768px)']

      if (state.breakpoints['(max-width: 500px)'] && this.displayedColumns.length != 3) {
        // remove createdDate and members columns when the viewport width is less than 500px
        this.displayedColumns.splice(2, 2)
      }
      else if (state.breakpoints['(min-width: 500px)'] && this.displayedColumns.length != 5) {
        // add createdDate and members columns when the viewport width is greater than 500px
        this.displayedColumns.splice(2, 0, ...['createdDate', 'members'])
      }

    })
  }

  public masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.rowSelected = false;
    } else {
      this.dataSource.data.forEach((row: any) => this.selection.select(row))
      this.rowSelected = true;
    }    
  }

  public checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`
  }

  public setEntitySelectionState(event: MouseEvent, entity: IFile, mode: string, gridEntity?: any): void {
    this.selection.toggle(entity)
    this.rowSelected = !this.rowSelected
  }

  public initializeTableData() {
    this.store$.pipe(
      select(getRepoData),
      withLatestFrom(this.store$.pipe(select(settingsSelector.getRepoSettings))),
      // delay(3000),
      tap((result: any) => {
        if (result[0].length && result[1].cwd) {
          this.generatePath(result[1].cwd)
        }
        return result;
      }),
      catchError((error: any) => observableOf([{ Name: "Unable to retrieve your files at this time" }])),
      takeUntil(this.destroy$),
    )
    .subscribe((data: any) => {
      if (data[1].cwd) {
        this.files = data[0]
        this.setCurrentDirectoryContents(data[1].cwd)
        this.isLoadingResults = false;
      }
    });
  }

  public setFavoriteState(entity: IFile): void {
    // const payload: Update<any> = {
    //   id: entity.Id,
    //   changes: { IsFavorite: !entity.IsFavorite }
    // }
    // this.store$.dispatch(filesystem.updateFavoriteStatus({ entity: payload, userId: this.userId }))
    this.fileActionsComponent.setFavoriteState(entity)
  }

  public renameEntity(entity: IFile): void {
    this.fileActionsComponent.renameAction(entity)
  }

  public deleteItem(index: number, row: IFile): void {
    this.fileActionsComponent.deleteAction(index, row);
    this.rowSelected = false;
  }

  public uploadData(event: any): void {
    this.fileActionsComponent.uploadData(event);
  }

  public createNewFolder(): void {
    this.fileActionsComponent.createNewFolder();
  }

  public getFolderContents(event: MouseEvent, entity: any): void {

    event.stopPropagation()
    event.preventDefault()

    if (entity.Type === 'File') {
      return;
    }

    this.generatePath(entity.Path)

    this.setCurrentDirectoryContents(entity.Path)

  }

  private generatePath(path: string): void {
    this.cwd = path

    this.path = []

    if (path != "/") {
      this.path = path.split('/');
      this.path.splice(0, 1);
    }
  }

  private setCurrentDirectoryContents(path: string): void {

    let files: any[] = this.files.filter((file: any) => file.Cwd === path)

    if (!files.length) {
      files.push({ Name: "No Contents to display" })
      this.isFolderEmpty = true
    } 
    else {
      this.isFolderEmpty = false
    }

    if (this.displayMode === 1) {
      this.files$ = of(files)
    } 
    else {
      this.dataSource = new MatTableDataSource(files)
      // this.dataSource.paginator = this.paginator
      // this.dataSource.sort = this.sort
    }
    
  }

  public navigateToNode(event: MouseEvent, index: number): void {

    let path = this.path;

    if (!this.path.length) {
      return;
    }

    if (index === 0) {
      this.path = [];
    } else {
      path.splice(index, path.length - index)
    }

    let entity = {
      Path: index === 0 ? '/' : `/${path.toString().replace(/,/g, '/')}`,
      Type: 'Folder'
    }

    this.getFolderContents(event, entity)

  }

  public setTableViewState(event: MouseEvent, mode: number): void {
    // this.selection.clear();
    this.displayMode = mode;
  }

  public showUploadDetailsDialog(): void {
    const config = new MatDialogConfig()

    config.width = '520px'
    config.height = '550px'

    config.data = {
      cwd: this.cwd,
      id: this.userId
    }

    const dialogRef = this.dialog.open(UploadDetailsComponent, config)

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: any) => console.log(result))
  }

  public showInfoDialog(entity: IFile): void {
    const config = new MatDialogConfig()

    config.width = '520px'
    config.height = '550px'

    config.data = {
      cwd: this.cwd,
      id: this.userId,
      entities: [entity],
      userName: this.userName
    }

    this.dialog.open(EntityInfoDialogComponent, config) //.afterClosed().pipe(take(1)).subscribe((result: any) => console.log(result))
  }

  public editFavoriteStatus(event: MouseEvent, entity: IFile): void {

    event.stopPropagation()

    const payload: Update<any> = {
      id: entity.Id,
      changes: { IsFavorite: !entity.IsFavorite }
    }

    this.store$.dispatch(filesystem.updateFavoriteStatus({ entity: payload, userId: this.userId }))
  }

  public downloadItem(name: string): void {
    this.fileActionsComponent.downloadAction(name)
  }

  public refreshFileView(): void {
    this.fileActionsComponent.refreshFiles()
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  
}
 