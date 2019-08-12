import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';

import * as notifications from '../../store/selectors/notification.selectors';
import * as notificationActions from '../../store/actions/notification.actions';

import { map } from 'rxjs/operators';
import { NotificationTypes } from '../../store/state';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit {
  public notifications$: Observable<any>;
  public notificationState: boolean = true;

  private id: string;
  constructor(private store$: Store<AppState>) {
   this.id = JSON.parse(localStorage.getItem('Account')).Id;
  }

  ngOnInit() {
    this.notifications$ = this.store$.pipe(
      select(notifications.selectAllNotifications),
      map((state: any) => {
        if (!state.length) {
          return [{
            title: 'No notifications at this time',
            type: NotificationTypes.Default
          }]
        }
        this.notificationState = false
        return state
      })
    )

  }

  public deleteAllNotifications(event: MouseEvent): void {
    event.stopPropagation()
    event.preventDefault()
    this.store$.dispatch(new notificationActions.DeleteAllNotifications({ id: this.id }))
    this.notificationState = true
  }

}
