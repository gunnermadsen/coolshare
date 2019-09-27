import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { NotificationActions, NotificationActionTypes } from '../actions/notification.actions';
import { Md5 } from 'ts-md5/dist/md5';
import * as uuid from 'uuid'
import { INotificationState } from '../state';
export interface NotificationState extends EntityState<any> {}

const sortByDate = (n1: INotificationState, n2: INotificationState): number => {
    return new Date(n2.createdOn).getTime() - new Date(n1.createdOn).getTime();
}

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({
    selectId: () => uuid.v4(),
    sortComparer: sortByDate
});

export const initialNotificationState: NotificationState = adapter.getInitialState()

export function notificationReducer(state = initialNotificationState, action: NotificationActions): NotificationState {
    switch (action.type) {
        case NotificationActionTypes.SAVE_NOTIFICATIONS:
            return adapter.addAll(action.payload.notifications, state);

        case NotificationActionTypes.CREATE_NOTIFICATION:
            return adapter.addOne(action.payload, state);
            
        case NotificationActionTypes.DELETE_ALL_NOTIFICATIONS:
            return adapter.removeAll(state);

        default: {
            return state;
        }
    }
}

// destructor the adapter object and get some selectors
export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();