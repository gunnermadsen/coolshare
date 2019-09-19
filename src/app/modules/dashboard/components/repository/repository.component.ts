import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, OnDestroy, isDevMode } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import { getRepoData } from '../../store/selectors/dashboard.selectors';
import { Observable, of as observableOf, Subject, of } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { catchError, tap, take, takeUntil, withLatestFrom, map, delay } from 'rxjs/operators';
import { IContents } from '@/shared/models/contents.model';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
// import { RetrieveFolderContents, DownloadItem } from '../../store/actions/filesystem.actions';

import * as filesystem from '../../store/actions/filesystem.actions'; 
import * as favorites from '../../store/actions/filesystem.actions';
import * as account from '@/modules/account/store/selectors/account.selectors';
import * as settingsSelector from '../../store/selectors/settings.selectors';

import { UploadDetailsComponent } from '../upload-details/upload-details.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FileActionsComponent } from '../file-actions/file-actions.component';
import { HttpRepoService } from '@/core/http/repo.http.service';

import { getRepoSettings } from '../../store/selectors/settings.selectors';
import { Update } from '@ngrx/entity';
import { RenameEntityComponent } from '../rename-entity/rename-entity.component';


@Component({
  selector: 'repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.less']
})
export class RepositoryComponent implements OnChanges, OnInit, OnDestroy {
  public dataSource: MatTableDataSource<IContents>
  public displayMode: number = 1
  public displayedColumns: string[] = ['select', 'name', 'createdDate', 'members', 'action']
  public isXS: boolean = true
  public rowSelected: boolean = false
  public isFolderEmpty: boolean = false
  public resultsLength: number
  public path: string[] = []
  public cwd: string
  public userName$: Observable<string>
  public files$: Observable<any>
  @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) public sort: MatSort
  @ViewChild(FileActionsComponent, { static: false }) public fileActionsComponent: FileActionsComponent
  @Input() public mode: number = 0;
  @Input() public userId: string;
  @Input() public userName: string;
  public isLoadingResults = true;
  public fileList: FileList;
  public files: any[] = [];
  private server: string;
  public selection: SelectionModel<any>;

  private destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(private store$: Store<AppState>, private repoService: HttpRepoService, private breakpointObserver: BreakpointObserver, public dialog: MatDialog) {
    this.selection = new SelectionModel<any>(true, []);
    this.server = isDevMode() ? 'http://localhost:3000' : 'https://portfolioapis.herokuapp.com'
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
      const user = JSON.parse(localStorage.getItem('Account'));
      this.userId = user.Id;
      this.userName$ = this.store$.pipe(select(account.selectUserName))
    }

    this.initializeTableData();
  }

  public getUrl(uri: string): string {
    return `url('${this.server}${uri}')`
  }

  public trackByFn<V, I>(value: V, index: I): V | I {
    return value
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
      withLatestFrom(this.store$.pipe(select(settingsSelector.getRepoSettings))),
      takeUntil(this.destroy$),
      // delay(3000),
      tap((result: any) => {
        if (result[0].length && result[1].cwd) {
          this.generatePath(result[1].cwd)
        }
        return result;
      }),
      catchError((error: any) => {
        return observableOf([]);
      })
    )
    .subscribe((data: any) => {
      if (data[0].length && data[1].cwd) {
        this.files = data[0]
        this.setCurrentDirectoryContents(data[1].cwd)
      } 
      this.isLoadingResults = false;
    });
  }

  public setFavoriteState(entity: any): void {
    const payload: Update<any> = {
      id: entity.Id,
      changes: { IsFavorite: !entity.IsFavorite }
    }
    this.store$.dispatch(new filesystem.ModifyFavorites({ entity: payload, userId: this.userId }))
  }

  public renameEntity(entity: any): void {
    const config = new MatDialogConfig()

    config.width = '520px'
    config.height = '250px'

    config.data = {
      name: entity.Name
    }

    const dialogRef = this.dialog.open(RenameEntityComponent, config)

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: any) => {

      const payload: Update<any> = {
        id: result.Id,
        changes: { Name: result.Name }
      }

      this.store$.dispatch(new filesystem.RenameEntity({ entity: payload, userId: this.userId }))
    })

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

    if (row.Type === 'File') {
      return;
    }

    this.generatePath(row.Path)

    this.setCurrentDirectoryContents(row.Path)

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

    this.dataSource = new MatTableDataSource(files)

    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort

    this.files$ = of(this.dataSource.data)
  }

  public navigateToNode(index: number): void {

    let path = this.path;

    if (!this.path.length) {
      return;
    }

    if (index === 0) {
      this.path = [];
    } else {
      path.splice(index, path.length - index)
    }

    let payload = {
      Path: index === 0 ? '/' : `/${path.toString().replace(/,/g, '/')}`,
      Type: 'Folder'
    }

    this.getFolderContents(payload)

  }

  public setTableViewState(event: MouseEvent, mode: number): void {
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

  public editFavoriteStatus($event: MouseEvent, entity: any): void {

    $event.stopPropagation()

    const payload: Update<any> = {
      id: entity.Id,
      changes: { IsFavorite: !entity.IsFavorite }
    }

    this.store$.dispatch(new favorites.ModifyFavorites({ entity: payload, userId: this.userId }))
  }

  public downloadItem(name: string): void {

    this.store$.dispatch(new filesystem.DownloadItem({ path: this.cwd, name: name, userId: this.userId }));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  
}
 