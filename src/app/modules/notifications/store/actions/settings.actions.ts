import { Action } from '@ngrx/store';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum NotificationSettingsActionTypes {
    SET_NOTIFICATION_VIEW_STATE = '[Notification Settings] Set Badge View State',
    SAVE_NOTIFICATION_VIEW_STATE = '[Notification Settings] Save Badge View State'
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class SetNotificationSettingsViewState implements Action {
    readonly type = NotificationSettingsActionTypes.SET_NOTIFICATION_VIEW_STATE;

    constructor(public payload: { id: string, notificationBadgeHidden: boolean }) { }
}

export class SaveNotificationSettingsViewState implements Action {
    readonly type = NotificationSettingsActionTypes.SAVE_NOTIFICATION_VIEW_STATE;

    constructor(public payload: { notificationBadgeHidden: boolean }) { }
}



/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type NotificationSettingsActions
    = SetNotificationSettingsViewState
    | SaveNotificationSettingsViewState
    ;
