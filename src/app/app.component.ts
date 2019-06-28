import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectUser } from './core/authentication/store/selectors/authentication.selectors';
import { LogoutUserRequested } from './core/authentication/store/actions/authentication.actions';
import { AppState } from './reducers/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public authState: boolean;
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.store.pipe(select(selectUser)).subscribe(result => {
      return this.authState = result.isLoggedIn;
    });
  }

  public logout(): void {
    this.store.dispatch(new LogoutUserRequested());
  }
}
