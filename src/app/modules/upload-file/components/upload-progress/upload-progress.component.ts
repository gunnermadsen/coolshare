import { Component, OnInit, Inject, Input, SimpleChanges, OnChanges, PLATFORM_ID } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { AppState } from '@/reducers'
import { Observable } from 'rxjs'
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material'
import { UploadDetailsComponent } from '@/modules/dashboard/components/upload-details/upload-details.component'
import { take, map } from 'rxjs/operators'

import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts' 
import * as fromFileUploadActions from '@/modules/upload-file/store/actions/upload.actions.ts'
import * as upload from '@/modules/upload-file/store/actions/upload.actions' 

import { isPlatformBrowser } from '@angular/common'


@Component({
  selector: 'upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.less']
})
export class UploadProgressComponent implements OnChanges, OnInit {
  public completed$: Observable<boolean>
  public progress$: Observable<number>
  public individualProgress$: Observable<number>
  public error$: Observable<string>
  public isInProgress$: Observable<boolean>
  public isReady$: Observable<boolean>
  public hasFailed$: Observable<boolean>
  public viewState$: Observable<boolean>
  private userId: string
  @Input() public progress: any
  @Input() public key: number
  @Input() public color: string

  constructor(@Inject(PLATFORM_ID) private platformId: object, private store$: Store<AppState>, private dialog: MatDialog, private snackbar: MatSnackBar) {
    
    if (isPlatformBrowser(this.platformId)) {
      this.userId = JSON.parse(localStorage.getItem('Account')).Id
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getProgressState()
  }

  ngOnInit() {
    this.completed$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileCompleted)
    )

    this.error$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileError)
    )

    this.isInProgress$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileInProgress)
    )

    // this.progressState$ = this.store$.pipe(
    //   select(fromFileUploadSelectors.)
    // )

    this.isReady$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileReady)
    )

    this.hasFailed$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileFailed)
    )

    this.viewState$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadViewState)
    )

    this.getProgressState()

  }

  private getProgressState(): void {
    this.progress$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadState),
      map((state: any) => {
        if (this.progress) {
          return state.files[this.key].progress
        }
        else {
          return state.progress
        }
      })
    )
  }

  public viewDetails(): void {
    this.store$.dispatch(new fromFileUploadActions.UploadViewStateAction({ viewState: false }))

    const config = new MatDialogConfig()

    config.width = '520px'
    config.height = '500px'

    // config.data = {
    //   cwd: this.cwd,
    //   id: this.userId
    // }

    const dialogRef = this.dialog.open(UploadDetailsComponent, config)

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: any) => {
      this.store$.dispatch(new fromFileUploadActions.UploadViewStateAction({ viewState: true }))
    })
  }

  public closeSnackbar(): void {
    // this.store$.dispatch(new fromFileUploadActions.UploadViewStateAction({ viewState: false }))
    this.store$.dispatch(new upload.UploadResetAction())
    // this.snackbar.dismiss()
  }


}
