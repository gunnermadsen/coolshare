import { Injectable } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as notifications from '../actions/notification.actions';
import * as notificationSettings from '../actions/settings.actions';

import { exhaustMap, map, mergeMap, catchError, tap, switchMap } from 'rxjs/operators';
import { HttpNotificationService } from '@/core/http/notification.http.service';


@Injectable()
export class NotificationEffects {

    @Effect()
    public createNewNotification$: Observable<Action> = this.actions$.pipe(
        ofType(notifications.NotificationActionTypes.CREATE_NOTIFICATION),
        exhaustMap((action: any) => {
            return this.notificationService.createNotification(action.payload).pipe(

                map((payload: any) => {
                    return new notificationSettings.SaveNotificationSettingsViewState({ notificationBadgeHidden: payload.notificationBadgeHidden })
                }),
                // tap((action) => action),

                catchError(error => throwError(error))

            )
        })
    )

    @Effect()
    public getNotifications$ = this.actions$.pipe(
        ofType(notifications.NotificationActionTypes.FETCH_NOTIFICATIONS),
        exhaustMap((action: any) => {
            return this.notificationService.getNotifications(action.payload.id).pipe(

                switchMap((payload: any) => {
                    return [
                        new notifications.SaveNotifications({ notifications: payload.Notifications }),
                        new notificationSettings.SaveNotificationSettingsViewState({ notificationBadgeHidden: payload.NotificationBadgeHidden })
                    ]
                }),
                
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

    @Effect()
    public setNotificationViewState$: Observable<Action> = this.actions$.pipe(
        ofType(notificationSettings.NotificationSettingsActionTypes.SET_NOTIFICATION_VIEW_STATE),
        mergeMap((action: any) => {
            return this.notificationService.setNotificationViewState(action.payload.id, action.payload.notificationBadgeHidden).pipe(
                map((payload: any) => {
                    return new notificationSettings.SaveNotificationSettingsViewState({ notificationBadgeHidden: action.payload.notificationBadgeHidden }) 
                }),
                catchError((error) => throwError(error))
            )
        })
    )

    constructor(private actions$: Actions, private notificationService: HttpNotificationService) { }
}