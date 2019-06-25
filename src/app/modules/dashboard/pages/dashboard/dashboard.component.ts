import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { RetrieveFolderContents } from '../../store/actions/filesystem.actions';
import { Observable } from 'rxjs';
import { getRepoData } from '../../store/selectors/dashboard.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  public repoData$: Observable<any>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.repoData$ = this.store.pipe(select(getRepoData));
  }

}
