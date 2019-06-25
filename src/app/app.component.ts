import { Component } from '@angular/core';
import { AppState } from './reducers';
import { Store } from '@ngrx/store';
import { RetrieveFolderContents } from './modules/dashboard/store/actions/filesystem.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    //this.store.dispatch(new RetrieveFolderContents());
  }
}
