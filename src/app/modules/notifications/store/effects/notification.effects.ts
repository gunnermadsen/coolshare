import { Injectable } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as notifications from '../actions/notification.actions';
import { saveAs } from 'file-saver'

import { exhaustMap, map, mergeMap, catchError, concatMap, takeUntil, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FileSaverService } from 'ngx-filesaver';
import { HttpNotificationService } from '@/core/http/notification.http.service';


@Injectable()
export class NotificationEffects {

    constructor(private actions$: Actions, private notificationService: HttpNotificationService, private toastrService: ToastrService, private fileSaver: FileSaverService) { }

    @Effect({ dispatch: false })
    public createNewNotification$: Observable<Action> = this.actions$.pipe(
        ofType(notifications.NotificationActionTypes.CREATE_NOTIFICATION),
        exhaustMap((action: any) => {
            return this.notificationService.createNotification(action.payload).pipe(

                tap((action) => action),

                catchError(error => throwError(error))
                
            )
        })
    )

    @Effect()
    public getNotifications$: Observable<Action> = this.actions$.pipe(
        ofType(notifications.NotificationActionTypes.FETCH_NOTIFICATIONS),
        exhaustMap((action: any) => {
            return this.notificationService.getNotifications(action.payload.id).pipe(

                map((payload: any) => new notifications.SaveNotifications({ notifications: payload.Notifications })),
                
                catchError(error => throwError(error))

            )
        })
    )

    @Effect({ dispatch: false })
    public deleteAllNotifications$: Observable<Action> = this.actions$.pipe(
        ofType(notifications.NotificationActionTypes.DELETE_ALL_NOTIFICATIONS),
        mergeMap((action: any) => {
            return this.notificationService.deleteAllNotifications(action.payload.id).pipe(

                tap(() => console.log("All Notifications have been deleted")),

                catchError((error) => throwError(error))
            )
        })
    )
}