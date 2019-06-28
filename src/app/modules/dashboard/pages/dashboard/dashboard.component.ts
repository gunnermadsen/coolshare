import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import { RetrieveFolderContents } from '../../store/actions/filesystem.actions';
import { Observable } from 'rxjs';
import { getRepoData } from '../../store/selectors/dashboard.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit() {

    const account = JSON.parse(localStorage.getItem('Account'));
    
    const data = {
      id: account.Id,
      path: '/'
    };

    this.store.dispatch(new RetrieveFolderContents({ folder: data }));

  }

}
