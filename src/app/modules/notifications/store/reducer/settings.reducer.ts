import { initialNotificationSettingsState, NotificationSettingsState } from '../state';
import { createReducer, on, Action } from '@ngrx/store';

import * as NotificationSettingsActions from '../actions/settings.actions';

const reducer = createReducer(
    initialNotificationSettingsState,
    on(NotificationSettingsActions.saveNotificationSettingsViewState, (state: NotificationSettingsState, { notificationBadgeHidden }) => {
        return {
            notificationBadgeHidden: notificationBadgeHidden
        }
    })
)

export function notificationSettingsReducer(state: NotificationSettingsState | undefined, action: Action) {
    return reducer(state, action)
}
