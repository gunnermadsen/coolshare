import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';

import * as notificationActions from '../../store/actions/notification.actions';
import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import { tap } from 'rxjs/operators';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit {
  private viewState: boolean

  public isUploadActive: boolean = false

  @Input() 
  public notifications: any

  @Input() 
  public id: string

  @Input()
  public isEmpty: boolean

  @Output()
  public closeSidenav: EventEmitter<any> = new EventEmitter<any>()

  public fileUploadState$: Observable<boolean>;


  constructor(private store$: Store<AppState>) {
  }

  public ngOnInit() {
    this.fileUploadState$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadState),
      tap((state: any) => {
        this.isUploadActive = state.progress >= 1 || state.progress <= 99 ? true : false
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

  public closeNotificationSidenav(): void {
    this.closeSidenav.emit()
  }

}
