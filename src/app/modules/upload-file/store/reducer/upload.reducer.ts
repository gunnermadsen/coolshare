import { Actions, ActionTypes } from '../actions/upload.actions';
import { initialState, State, UploadStatus } from '../../state';
import * as _ from 'lodash';

const setFileState = (files: any): any[] => {
    let data: any[] = [];
    Object.values(files).forEach((file: File, index: number) => {
        data.push({
            progress: 0,
            file: file,
            loaded: 0,
            completed: false
        })
    });
    return data;
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
                currentFile: 0,
                status: UploadStatus.Requested,
                progress: null,
                error: null,
                files: setFileState(action.payload.files),
                viewState: true
            };
            return result;
        }

        case ActionTypes.UPLOAD_CURRENT_FILE: {
            return {
                ...state,
                currentFile: action.payload.currentFile
            }
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
                files: action.payload.files
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