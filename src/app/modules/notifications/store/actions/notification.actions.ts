import { Action } from '@ngrx/store';
import { NotificationTypes } from '../state';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum NotificationActionTypes {
    CREATE_NOTIFICATION = '[Notifications API] Create Notification From Event',
    FETCH_NOTIFICATIONS = '[Get Notifications API] Get Notifications',
    SAVE_NOTIFICATIONS = '[Notifications Client] Save Retrieved Notifications',
    DELETE_ALL_NOTIFICATIONS = '[Notifications API] Delete All Notifications'
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class CreateNewNotification implements Action {
    readonly type = NotificationActionTypes.CREATE_NOTIFICATION;

    constructor(public payload: { type: NotificationTypes, createdOn: Date, title: string, userId: string, options?: any }) { }
}

export class FetchNotifications implements Action {
    readonly type = NotificationActionTypes.FETCH_NOTIFICATIONS;
    constructor(public payload: { id: string }) {}
}

export class SaveNotifications implements Action {
    readonly type = NotificationActionTypes.SAVE_NOTIFICATIONS;

    constructor(public payload: { notifications: any }) {}
}

export class DeleteAllNotifications implements Action {
    readonly type = NotificationActionTypes.DELETE_ALL_NOTIFICATIONS;

    constructor(public payload: { id: string }) {}
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type NotificationActions
    = CreateNewNotification
    | FetchNotifications
    | SaveNotifications
    | DeleteAllNotifications;
