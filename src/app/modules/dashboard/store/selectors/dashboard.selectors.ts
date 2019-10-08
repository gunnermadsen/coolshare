import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store'
import { IFile } from '@/shared/models/file.model'
export const selectRepositoryState = createFeatureSelector<any>('FileSystem')

const getEntities = (entities: any): IFile[] => Object.values(entities)

export const getRepoData = createSelector(
    selectRepositoryState,
    (filesystem: any) => {
        return getEntities(filesystem.Content.entities)
    }
)

export const getFavorites: MemoizedSelector<object, any> = createSelector(
    selectRepositoryState,
    (filesystem: any) => {
        return getEntities(filesystem.Content.entities).filter((file: any) => file.IsFavorite)
    }
)

export const getRecents: MemoizedSelector<object, any> = createSelector(
    selectRepositoryState,
    (filesystem: any) => {
        return getEntities(filesystem.Content.entities).sort((a: any, b: any) => new Date(a.CreatedOn).getTime() - new Date(b.CreatedOn).getTime())
    }
)

export const getSuggestions: MemoizedSelector<object, any> = createSelector(
    selectRepositoryState,
    (filesystem: any) => {
        return getEntities(filesystem.Content.entities).filter((file: any) => new Date(file.CreatedOn) <= new Date(Date.now() - 500000000))
    }
)