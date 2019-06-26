import { Component } from '@angular/core';
import { AppState } from './reducers';
import { Store, select } from '@ngrx/store';
import { RetrieveFolderContents } from './modules/dashboard/store/actions/filesystem.actions';
import { selectAuthState } from './core/authentication/store/selectors/authentication.selectors';
import { Observable } from 'rxjs';
import { LogoutUserRequested } from './core/authentication/store/actions/authentication.actions';
import { MatSidenav, MatDrawer } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public authState: boolean;
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.store.pipe(select(selectAuthState)).subscribe(result => {
      if (result) {
        this.store.dispatch(new RetrieveFolderContents());
      }
      return this.authState = result;
    });
  }

  public logout(): void {
    this.store.dispatch(new LogoutUserRequested());
    //this.sidenav.close();
  }
}
