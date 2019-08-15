import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';

import * as notifications from '../../store/selectors/notification.selectors';

import * as notificationActions from '../../store/actions/notification.actions';
import * as notificationSettingsActions from '../../store/actions/settings.actions';

import { map, tap } from 'rxjs/operators';
import { NotificationTypes } from '../../store/state';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit {
  public notifications$: Observable<any>
  public viewState$: Observable<boolean>
  private viewState: boolean
  public isEmpty: boolean = true
  private id: string

  constructor(private store$: Store<AppState>) {
   this.id = JSON.parse(localStorage.getItem('Account')).Id;
  }

  public ngOnInit() {
    this.viewState$ = this.store$.pipe(
      select(notifications.selectViewState),
      tap((result: any) => {
        this.viewState = result
        return result;
      })
    )

    this.notifications$ = this.store$.pipe(
      select(notifications.selectAllNotifications),
      map((state: any) => {
        if (!state.length) {
          return [{
            title: 'No notifications at this time',
            type: NotificationTypes.Default
          }]
        }
        this.isEmpty = false
        return state
      })
    )

  }

  public deleteAllNotifications(event: MouseEvent): void {
    event.stopPropagation()
    event.preventDefault()
    this.store$.dispatch(new notificationActions.DeleteAllNotifications({ id: this.id }))
    this.isEmpty = true;
  }

  public refreshNotifications(event: MouseEvent): void {
    event.stopPropagation()
    event.preventDefault()
    this.store$.dispatch(new notificationActions.FetchNotifications({ id: this.id }))
  }

  public setNotificationViewState(event: MouseEvent): void {
    if (!this.viewState) {
      this.store$.dispatch(new notificationSettingsActions.SetNotificationSettingsViewState({ id: this.id, notificationBadgeHidden: true }))
    }
  }

}
