import { Actions, ActionTypes } from '../actions/upload.actions';
import { initialState, State, UploadStatus } from '../../state';

const setFileState = (files: any): any[] => {
    let data: any[] = [];
    Object.values(files).forEach((file: File, index: number) => {
        data.push({
            progress: null,
            file: file
        })
    });
    return data;
}

const updateFileUploadProgress = (state: State, progress: number, index: number) => {
    return state.files[index].progress = progress;
}

export function uploadReducer(state = initialState, action: Actions): State {
    switch (action.type) {
        case ActionTypes.UPLOAD_VIEW_STATE: {
            return {
                ...state,
                viewState: action.payload.viewState
            }
        }
        case ActionTypes.UPLOAD_REQUEST: {
            const result = {
                ...state,
                status: UploadStatus.Requested,
                progress: null,
                error: null,
                // files: setFileState(action.payload.files),
                files: action.payload.files,
                viewState: true
            };
            return result;
        }
        case ActionTypes.UPLOAD_CANCEL: {
            return {
                ...state,
                status: UploadStatus.Ready,
                progress: null,
                error: null,
            };
        }
        case ActionTypes.UPLOAD_RESET: {
            return {
                ...state,
                status: UploadStatus.Ready,
                progress: null,
                error: null,
            };
        }
        case ActionTypes.UPLOAD_FAILURE: {
            return {
                ...state,
                status: UploadStatus.Failed,
                error: action.payload.error,
                progress: null,
            };
        }
        case ActionTypes.UPLOAD_STARTED: {
            return {
                ...state,
                status: UploadStatus.Started,
                progress: 0,
            };
        }
        case ActionTypes.UPLOAD_PROGRESS: {
            const result = {
                ...state,
                progress: action.payload.progress,
                // files: {
                //     ...state.files[action.payload.index].progress
                // }//updateFileUploadProgress(state, action.payload.progress, action.payload.index)
            };
            return result;
        }
        case ActionTypes.UPLOAD_COMPLETED: {
            return {
                ...state,
                status: UploadStatus.Completed,
                progress: 100,
                error: null
            };
        }
        default: {
            return state;
        }
    }
}