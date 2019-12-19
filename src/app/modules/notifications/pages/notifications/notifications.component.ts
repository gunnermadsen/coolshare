import { Component, OnInit, Input, Output, EventEmitter, Inject, PLATFORM_ID, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';
import * as notifications from '@/modules/notifications/store/selectors/notification.selectors'

import * as notificationActions from '../../store/actions/notification.actions';
import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import { tap, map } from 'rxjs/operators';
import { INotificationState, NotificationTypes } from '../../store/state';
import { deleteAllNotifications, fetchNotifications } from '../../store/actions/notification.actions';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit, OnChanges {
  public isUploadActive: boolean = false
  public userId: string

  // @Input()
  public isEmpty: boolean = true

  @Input()
  public notifications: any[]

  @Output()
  public closeSidenav: EventEmitter<any> = new EventEmitter<any>()

  public fileUploadState$: Observable<boolean>;

  constructor(private store$: Store<AppState>, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const account = JSON.parse(localStorage.getItem('Account'))
      if (account) {
        this.userId = account.Id
      }
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.notifications.currentValue[0].notificationType != "Default") {
      this.isEmpty = false
      changes.notifications.currentValue.sort((n1: INotificationState, n2: INotificationState) => new Date(n2.createdOn).getTime() - new Date(n1.createdOn).getTime())
    } else {
      this.isEmpty = true
    }
  }

  public ngOnInit(): void {
    this.fileUploadState$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectCurrentUploadState),
      tap((state: any) => {
        if (state.progress >= 1) {
          this.isUploadActive = true
        }
        // this.isUploadActive =  ? true : false //|| state.progress <= 99
      })
    )
  }

  public deleteAllNotifications(event: MouseEvent): void {
    event.stopPropagation()
    event.preventDefault()
    this.store$.dispatch(deleteAllNotifications({ id: this.userId }))
    this.isEmpty = true;
  }

  public refreshNotifications(event: MouseEvent): void {
    event.stopPropagation()
    event.preventDefault()
    this.store$.dispatch(fetchNotifications({ id: this.userId }))
  }

  public closeNotificationSidenav(): void {
    this.closeSidenav.emit()
  }

}
