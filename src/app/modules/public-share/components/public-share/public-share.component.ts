import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@/reducers';
import * as filesystem from '@/modules/dashboard/store/actions/filesystem.actions';
import { SaveRetrievedFolderSettings } from '@/modules/dashboard/store/actions/settings.actions';

@Component({
  selector: 'app-public-share',
  templateUrl: './public-share.component.html',
  styleUrls: ['./public-share.component.less']
})
export class PublicShareComponent implements OnInit {
  public id: string;
  public userName: string;

  public isLoaded: boolean;

  constructor(private route: ActivatedRoute, private store$: Store<AppState>) { }

  ngOnInit() {
    const data = this.route.snapshot.data.result;

    if (data) {
      this.isLoaded = true;

      this.id = this.route.snapshot.data.result.userId;
      this.userName = this.route.snapshot.data.result.userName;
  
      this.store$.dispatch(filesystem.saveRetrievedFolderContents({ contents: data.files }));
      this.store$.dispatch(new SaveRetrievedFolderSettings({ settings: data.settings }))

    } else {

      this.isLoaded = false;
      
    }

  }

}
