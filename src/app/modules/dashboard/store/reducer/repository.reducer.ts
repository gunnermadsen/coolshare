import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as FileSystemActions from '../actions/filesystem.actions';

export interface FileSystemState extends EntityState<any> {}

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({ selectId: (file: any) => file.Id })

export const initialFileSystemState: FileSystemState = adapter.getInitialState()

const reducer = createReducer(
    initialFileSystemState,
    on(FileSystemActions.saveRetrievedFolderContents, (state: FileSystemState, { contents }) => adapter.addAll(contents, state)),
    on(FileSystemActions.updateFavoriteStatus, (state: FileSystemState, { entity }) => adapter.updateOne(entity, state)),
    on(FileSystemActions.renameEntity, (state: FileSystemState, { entity }) => adapter.updateOne(entity, state)),
    on(FileSystemActions.deleteFolderEntity, (state: FileSystemState, { id }) => adapter.removeOne(id, state)),
    on(FileSystemActions.deleteFolderEntities, (state: FileSystemState, { ids }) => adapter.removeMany(ids, state))
)

export function FileSystemReducer(state: FileSystemState | undefined, action: Action) {
    return reducer(state, action)
}

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();