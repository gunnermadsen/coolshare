import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

export const notificationSettingsStateFeatureSelector = createFeatureSelector<any>('Settings');


export const selectViewState: MemoizedSelector<object, boolean> = createSelector(
    notificationSettingsStateFeatureSelector,
    (result: any): boolean => {
        return result.Settings.viewState
    }
)

