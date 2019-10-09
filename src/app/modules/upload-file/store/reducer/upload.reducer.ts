import { UploadActions, ActionTypes } from '../actions/upload.actions'
import { initialState, UploadStatus, UploadState } from '../../state'
import * as _ from 'lodash'

const setFileState = (files: any): any[] => {
    let data: any[] = []
    Object.values(files).forEach((file: File, index: number) => {
        data.push({
            progress: 0,
            file: file,
            loaded: 0,
            completed: false,
            status: UploadStatus.Ready
        })
    })
    return data
}

export function uploadReducer(state = initialState, action: UploadActions): UploadState {
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
                progressColor: 'primary',
                error: null,
                pendingFiles: setFileState(action.payload.files),
                completedFiles: [],
                viewState: true
            }
            return result
        }

        case ActionTypes.UPLOAD_CURRENT_FILE: {
            return {
                ...state
            }
        }
        case ActionTypes.SINGLE_FILE_UPLOAD_CANCELLED: {
            return {
                ...state,
            }
        }
        case ActionTypes.UPLOAD_CANCEL: {
            return {
                ...state,
                status: UploadStatus.Ready,
                progress: null,
                error: null,
            }
        }
        case ActionTypes.UPLOAD_RESET: {
            return {
                ...state,
                status: UploadStatus.Ready,
                progress: null,
                error: null,
                viewState: false
            }
        }
        case ActionTypes.UPLOAD_FAILURE: {
            return {
                ...state,
                status: UploadStatus.Failed,
                error: action.payload.error,
                progress: null,
                progressColor: 'warm'
            }
        }
        case ActionTypes.SINGLE_FILE_UPLOAD_FAILURE: {
            return {
                ...state,
                status: UploadStatus.Failed,
                pendingFiles: action.payload.files
               
            }
        }
        case ActionTypes.UPLOAD_STARTED: {
            return {
                ...state,
                status: UploadStatus.Started,
                progress: 0,
            }
        }
        case ActionTypes.UPLOAD_PROGRESS: {
            return {
                ...state,
                status: UploadStatus.Ongoing,
                progress: action.payload.progress,
                progressColor: 'primary',
                pendingFiles: action.payload.files
            }
        }
        case ActionTypes.UPLOAD_COMPLETED: {
            const result = {
                ...state,
                status: UploadStatus.Completed,
                completedFiles: state.pendingFiles,
                pendingFiles: [],
                progressColor: 'accent',
                progress: 100,
                error: null
            }
            return result
        }
        case ActionTypes.SINGLE_FILE_UPLOAD_COMPLETED: {
            return {
                ...state,
                status: UploadStatus.Completed,
                pendingFiles: action.payload.files,
                error: null
            }
        }
        case ActionTypes.SINGLE_FILE_UPLOAD_PAUSED: {
            return {
                ...state
            }
        }
        default: {
            return state
        }
    }
}