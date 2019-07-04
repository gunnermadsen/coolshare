import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IContents } from '@/shared/models/contents.model';

export const selectRepositoryState = createFeatureSelector<any>('fs');


export const getRepoData = createSelector(
    selectRepositoryState,
    repoState => {
        //return Object.values(repoState.entities).filter((entity: any) => entity.creationDate > Date.now() - (1000 * 60 * 60 * 24 * 10));
        return Object.values(repoState.entities);

        //Object.values(repoState.entities).filter((entity: any, index: number) => {
        //     if (index === 4) return;
        //     return entity
        // });
    }
)
