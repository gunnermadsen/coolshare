import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { FileSystemActions, FileSystemActionTypes } from '../actions/filesystem.actions';

export interface FileSystemState extends EntityState<any> {}

export const adapter: EntityAdapter<any> = createEntityAdapter<any>();

// {
//     selectId: meeting => meeting.Id
// }

export const initialFileSystemState: FileSystemState = adapter.getInitialState()

export function fileSystemReducer(state = initialFileSystemState, action: FileSystemActions): FileSystemState {
    switch (action.type) {
        case FileSystemActionTypes.CreateNode:
            return adapter.addOne(action.payload.node, state);

        case FileSystemActionTypes.SaveRetrievedFolderContents:
            return adapter.addAll(action.payload.contents, { ...state });

        // case FileSystemActionTypes.UpdateRetrievedFolderContents:
        //     return adapter.updateMany(action.payload.contents, state);

        // case FileSystemActionTypes.DeleteMeeting:
        //     return adapter.removeOne(action.payload.meetingId, state);

        default: {
            return state;
        }
    }
}

// destructor the adapter object and get some selectors
export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();