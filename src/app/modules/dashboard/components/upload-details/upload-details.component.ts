import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 

import * as fromFileUploadActions from '@/modules/upload-file/store/actions/upload.actions.ts';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';


@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.less']
})
export class UploadDetailsComponent implements OnInit {

  public files$: Observable<boolean>;
  public completed$: Observable<boolean>;
  public progressColor$: Observable<string>;

  constructor(private store$: Store<AppState>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialogRef<any>) { }

  ngOnInit() {
    this.files$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileState)
    )

    this.completed$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileCompleted)
    );
  }

  public removeListItem(i: number): void {
    console.log(i)
  }

  public uploadFiles(event: any): void {
    console.log(event.target.files);
  }

  public closeDialog(): void {
    this.store$.dispatch(new fromFileUploadActions.UploadViewStateAction({ viewState: true }))
    this.dialog.close();
  }

  public cancelUpload(index: number): void {
    this.store$.dispatch(new fromFileUploadActions.UploadCancelAction({ index: index }))
  }

  public getProgressColor$(index: number): Observable<string> {
    return this.store$.pipe(
      select(fromFileUploadSelectors.selectProgressBarColor(index))
    )
  }

}
