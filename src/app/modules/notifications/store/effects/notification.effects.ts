import { Injectable } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';

import * as notifications from '../actions/notification.actions';
import * as settings from '../actions/settings.actions';

import { exhaustMap, map, mergeMap, catchError, tap, switchMap } from 'rxjs/operators';
import { HttpNotificationService } from '@/core/http/notification.http.service';
import { saveNotifications } from '../actions/notification.actions';



@Injectable()
export class NotificationEffects {

    public createNewNotification$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(notifications.createNewNotification),
        exhaustMap((payload: any) => {
            return this.notificationService.createNotification(payload).pipe(

                map((payload: any) => {
                    return settings.saveNotificationSettingsViewState({ notificationBadgeHidden: payload.notificationBadgeHidden })
                }),

                catchError(error => throwError(error))

            )
        })
    ))

    public getNotifications$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(notifications.fetchNotifications),
        exhaustMap((payload: any) => {
            return this.notificationService.getNotifications(payload.id).pipe(

                switchMap((payload: any) => {
                    return [
                        saveNotifications({ notifications: payload.Notifications }),
                        settings.saveNotificationSettingsViewState({ notificationBadgeHidden: payload.NotificationBadgeHidden })
                    ]
                }),
                
                catchError(error => throwError(error))

            )
        })
    ))

    public deleteAllNotifications$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(notifications.deleteAllNotifications),
        mergeMap((payload: any) => {
            return this.notificationService.deleteAllNotifications(payload.id).pipe(

                tap(() => console.log("All Notifications have been deleted")),

                catchError((error) => throwError(error))
            )
        })
    ), { dispatch: false })

    public setNotificationViewState$: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(settings.setNotificationSettingsViewState),
        mergeMap((payload: any) => {
            return this.notificationService.setNotificationViewState(payload.id, payload.notificationBadgeHidden).pipe(
                map((payload: any) => {
                    return settings.saveNotificationSettingsViewState({ notificationBadgeHidden: payload.notificationBadgeHidden });
                }),
                catchError((error) => throwError(error))
            )
        })
    ))

    constructor(private actions$: Actions, private notificationService: HttpNotificationService) { }
}