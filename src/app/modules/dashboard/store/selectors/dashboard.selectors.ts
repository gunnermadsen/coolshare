import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

export const selectRepositoryState = createFeatureSelector<any>('FileSystem');


export const getRepoData = createSelector(
    selectRepositoryState,
    repoState => {
        return Object.values(repoState.Content.entities);
    }
)