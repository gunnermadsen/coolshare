import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectUser } from './core/authentication/store/selectors/authentication.selectors';
import { LogoutUserRequested } from './core/authentication/store/actions/authentication.actions';
import { AppState } from './reducers/index';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import { tap } from 'rxjs/operators';
import { UploadProgressComponent } from './modules/upload-file/components/upload-progress/upload-progress.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public authState: boolean;
  constructor(private store: Store<AppState>, private snackBar: MatSnackBar) {}
  ngOnInit(): void {
    this.store.pipe(select(selectUser)).subscribe((result: any) => {
      return this.authState = result.isLoggedIn;
    });

    this.store.pipe(
      select(fromFileUploadSelectors.selectUploadViewState)
    ).subscribe((state: any): void => {
      return this.openSnackBar(state);
    })
  }

  public logout(): void {
    this.store.dispatch(new LogoutUserRequested());
  }

  private openSnackBar(state: boolean): void {
    if (state) {
      this.snackBar.openFromComponent(UploadProgressComponent);
    } else {
      this.snackBar.dismiss()
    }
  }

}
