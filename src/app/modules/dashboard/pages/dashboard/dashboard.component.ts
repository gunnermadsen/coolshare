import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import * as filesystem from '../../store/actions/filesystem.actions';
import { Observable } from 'rxjs';
import { getRepoData } from '../../store/selectors/dashboard.selectors';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor(private store: Store<AppState>, private route: ActivatedRoute) { }

  ngOnInit() {

    const account = JSON.parse(localStorage.getItem('Account'));
    
    if (account) {
  
      this.store.dispatch(filesystem.readEntityContents({ folder: '/', id: account.Id }));
      
    } 

  }

}
