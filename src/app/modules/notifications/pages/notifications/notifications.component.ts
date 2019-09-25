import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@/reducers';

import * as notificationActions from '../../store/actions/notification.actions';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit {
  private viewState: boolean

  @Input() 
  public notifications: any

  @Input() 
  public id: string

  @Input()
  public isEmpty: boolean

  @Output()
  public closeSidenav: EventEmitter<any> = new EventEmitter<any>()

  constructor(private store$: Store<AppState>) {
  }

  public ngOnInit() { }

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

  public closeNotificationSidenav(): void {
    this.closeSidenav.emit()
  }

}
