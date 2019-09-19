import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { FileSystemActions, FileSystemActionTypes } from '../actions/filesystem.actions';


export interface FileSystemState extends EntityState<any> {}

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({ selectId: (file: any) => file.Id })

export const initialFileSystemState: FileSystemState = adapter.getInitialState()

export function FileSystemReducer(state = initialFileSystemState, action: FileSystemActions): FileSystemState {
    switch (action.type) {

        case FileSystemActionTypes.FS_SAVE_RETRIEVED_FOLDER_CONTENTS:
            return adapter.addAll(action.payload.contents, { ...state });

        case FileSystemActionTypes.FS_MODIFY_FAVORITE_STATUS:
            return adapter.updateOne(action.payload.entity, state);

        case FileSystemActionTypes.FS_RENAME_ENTITY:
            return adapter.updateOne(action.payload.entity, state);

        case FileSystemActionTypes.FS_DELETE_FOLDER_ITEM:
            return adapter.removeOne(action.payload.id, state);

        case FileSystemActionTypes.FS_DELETE_FOLDER_ITEMS:
            return adapter.removeMany(action.payload.ids, state);

        default: {
            return state;
        }
    }
}

// destructor the adapter object and get some selectors
export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();