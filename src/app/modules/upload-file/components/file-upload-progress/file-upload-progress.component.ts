import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';

import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import { tap } from 'rxjs/operators';


@Component({
  selector: 'file-upload-progress',
  templateUrl: './file-upload-progress.component.html',
  styleUrls: ['./file-upload-progress.component.less']
})
export class FileUploadProgressComponent implements OnInit {
  public fileUploadState$: Observable<boolean>;


  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.fileUploadState$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadState)
    )
  }

}
