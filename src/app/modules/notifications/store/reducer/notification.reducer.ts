import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
// import { NotificationActionTypes } from '../actions/notification.actions';
import { INotificationState } from '../state';
import { createReducer, on, Action } from '@ngrx/store';

import * as NotificationActions from '../actions/notification.actions'
export interface NotificationState extends EntityState<any> {}

const sortByDate = (n1: INotificationState, n2: INotificationState): number => {
    return new Date(n2.createdOn).getTime() - new Date(n1.createdOn).getTime();
}

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({
    selectId: (notification: any) => {
        return notification.id;
    }
    // sortComparer: sortByDate
});

export const initialNotificationState: NotificationState = adapter.getInitialState()

const reducer = createReducer(
    initialNotificationState,
    on(NotificationActions.saveNotifications, (state: NotificationState, { notifications }) => adapter.addAll(notifications, state)),
    on(NotificationActions.createNewNotification, (state: NotificationState, notification) => adapter.addOne(notification, state)),
    on(NotificationActions.deleteAllNotifications, (state: NotificationState) => adapter.removeAll(state))
)

export function notificationReducer(state: NotificationState | undefined, action: Action) {
    return reducer(state, action)
}

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();