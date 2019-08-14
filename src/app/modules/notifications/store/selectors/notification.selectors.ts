import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

export const notificationStateFeatureSelector = createFeatureSelector<any>('Notifications');


export const selectAllNotifications: MemoizedSelector<object, any> = createSelector(
    notificationStateFeatureSelector,
    (result: any): any[] => {
        return Object.values(result.Events.entities);
    }
)

export const selectViewState: MemoizedSelector<object, boolean> = createSelector(
    notificationStateFeatureSelector,
    (result: any): boolean => {
        return result.Settings.notificationBadgeHidden
    }
)


