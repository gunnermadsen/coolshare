import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IContents } from '@/shared/models/contents.model';

export const selectRepositoryState = createFeatureSelector<any>('fs');


export const getRepoData: MemoizedSelector<object, any> = createSelector(
    selectRepositoryState,
    repoState => {
        return Object.values(repoState.entities);
    }
)