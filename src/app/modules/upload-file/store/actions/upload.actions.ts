import { Action } from '@ngrx/store';

export enum ActionTypes {
    UPLOAD_VIEW_STATE = '[File Upload View] Current View State',
    UPLOAD_REQUEST = '[File Upload Form] Request',
    UPLOAD_CANCEL = '[File Upload Form] Cancel',
    UPLOAD_RESET = '[File Upload Form] Reset',
    UPLOAD_STARTED = '[File Upload API] Started',
    UPLOAD_PROGRESS = '[File Upload API] Progress',
    UPLOAD_PROGRESS_SUM = '[File Upload API] Progress Sum',
    UPLOAD_FAILURE = '[File Upload API] Failure',
    UPLOAD_COMPLETED = '[File Upload API] Success',
    UPLOAD_CURRENT_FILE = '[File Upload API] Switch Files',
    UPLOAD_FINISHED = '[File Upload API] Update Folder Contents'
}

export class UploadRequestAction implements Action {
    readonly type = ActionTypes.UPLOAD_REQUEST;
    constructor(public payload: { userId: string, path: string, files: any }) { }
}

export class UploadCurrentFileAction implements Action {
    readonly type = ActionTypes.UPLOAD_CURRENT_FILE;

    constructor(public payload: { currentFile: number }) {}
}

export class UploadCancelAction implements Action {
    readonly type = ActionTypes.UPLOAD_CANCEL;
}

export class UploadResetAction implements Action {
    readonly type = ActionTypes.UPLOAD_RESET;
}

export class UploadStartedAction implements Action {
    readonly type = ActionTypes.UPLOAD_STARTED;
}

export class UploadProgressAction implements Action {
    readonly type = ActionTypes.UPLOAD_PROGRESS;
    constructor(public payload: { progress: number, index: number, httpEvent: any }) { }
}

export class UploadProgressSumAction implements Action {
    readonly type = ActionTypes.UPLOAD_PROGRESS_SUM;
    constructor(public payload: { progress: number }) { }
}

export class UploadFailureAction implements Action {
    readonly type = ActionTypes.UPLOAD_FAILURE;
    constructor(public payload: { error: string }) { }
}

export class UploadCompletedAction implements Action {
    readonly type = ActionTypes.UPLOAD_COMPLETED;

    constructor(public payload: { index: number }) {}
}

export class UploadCompletedUpdateFolderAction implements Action {
    readonly type = ActionTypes.UPLOAD_FINISHED;
    constructor(public payload: { files: any }) {}
}

export class UploadViewStateAction implements Action {
    readonly type = ActionTypes.UPLOAD_VIEW_STATE;
    constructor(public payload: { viewState: boolean }) {}
}

export type Actions =
    | UploadRequestAction
    | UploadCancelAction
    | UploadResetAction
    | UploadStartedAction
    | UploadProgressAction
    | UploadFailureAction
    | UploadCompletedAction
    | UploadViewStateAction
    | UploadCurrentFileAction
    | UploadCompletedUpdateFolderAction;