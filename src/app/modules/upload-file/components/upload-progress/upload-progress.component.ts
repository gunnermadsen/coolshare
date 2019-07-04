import { Component, OnInit, Inject, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import { Observable } from 'rxjs';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { UploadDetailsComponent } from '@/modules/dashboard/components/upload-details/upload-details.component';
import { take } from 'rxjs/operators';
import * as fromFileUploadActions from '@/modules/upload-file/store/actions/upload.actions.ts';



@Component({
  selector: 'upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.less']
})
export class UploadProgressComponent implements OnInit {
  public completed$: Observable<boolean>;
  public progress$: Observable<number>;
  public error$: Observable<string>;
  public isInProgress$: Observable<boolean>;
  public isReady$: Observable<boolean>;
  public hasFailed$: Observable<boolean>;

  public viewState$: Observable<boolean>;

  private userId: string;

  constructor(private store$: Store<AppState>, private dialog: MatDialog) {
    this.userId = JSON.parse(localStorage.getItem('Account')).Id;
  }

  ngOnInit() {
    this.completed$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileCompleted)
    );

    this.progress$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileProgress)
    );

    this.error$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileError)
    );

    this.isInProgress$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileInProgress)
    );

    this.isReady$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileReady)
    );

    this.hasFailed$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileFailed)
    );

    this.viewState$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadViewState)
    )
  }

  public viewDetails(): void {
    this.store$.dispatch(new fromFileUploadActions.UploadViewStateAction({ viewState: false }))

    const config = new MatDialogConfig();

    config.width = '520px';
    config.height = '550px';

    // config.data = {
    //   cwd: this.cwd,
    //   id: this.userId
    // }

    const dialogRef = this.dialog.open(UploadDetailsComponent, config);

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: any) => {
      this.store$.dispatch(new fromFileUploadActions.UploadViewStateAction({ viewState: true }))
    })
  }

}
