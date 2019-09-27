import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/reducers';

import * as notificationActions from '../../store/actions/notification.actions';
import * as fromFileUploadSelectors from '@/modules/upload-file/store/selectors/upload.selectors.ts'; 
import { tap } from 'rxjs/operators';
import { INotificationState } from '../../store/state';

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

  constructor(private store$: Store<AppState>) { }

  public ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.notifications.currentValue.length > 1) {
      changes.notifications.currentValue.sort((n1: INotificationState, n2: INotificationState) => new Date(n2.createdOn).getTime() - new Date(n1.createdOn).getTime())
    }
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
