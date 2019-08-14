import { NotificationSettingsActionTypes, NotificationSettingsActions } from '../actions/settings.actions';
import { initialNotificationSettingsState, NotificationSettingsState } from '../state';


export function notificationSettingsReducer(state = initialNotificationSettingsState, action: NotificationSettingsActions): NotificationSettingsState {
    switch (action.type) {
        case NotificationSettingsActionTypes.SAVE_NOTIFICATION_VIEW_STATE: {
            return {
                notificationBadgeHidden: action.payload.notificationBadgeHidden
            }
        }

        default: {
            return state;
        }
    }
}
