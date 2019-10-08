import { Action, createAction, props } from '@ngrx/store';

// export const setNotificationSettingsViewState = createAction('[Notification Settings] Set Badge View State', props<{ id: string, notificationBadgeHidden: boolean }>())
export const saveNotificationSettingsViewState = createAction('[Notification Settings] Save Badge View State', props<{ id: string, notificationBadgeHidden: boolean }>())
