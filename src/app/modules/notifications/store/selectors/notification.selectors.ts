import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

export const notificationStateFeatureSelector = createFeatureSelector<any>('notifications');


export const selectAllNotifications: MemoizedSelector<object, any> = createSelector(
    notificationStateFeatureSelector,
    notifications => {
        return Object.values(notifications.entities);
    }
)