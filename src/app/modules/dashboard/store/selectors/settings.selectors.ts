import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

export const selectRepositorySettingsState = createFeatureSelector<any>('FileSystem');


export const getRepoSettings = createSelector(
    selectRepositorySettingsState,
    result => {
        return result.Settings
    }
)