import { Action } from '@ngrx/store';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum FileSystemActionTypes {
    RetrieveFolderContents = '[Get Folder Contents] Folder Contents Requested',
    CreateNode = '[Save File] File Save Requested',
    SaveRetrievedFolderContents = '[Saved Contents] Saved Retrieved Folder Contents',
    FileUploadRequested = '[File Upload] Upload File to Repo',
    UpdateRetrievedFolderContents = '[Update Folder Contents] Update Existing Contents',
    FileUploadFinished = '[File Upload] File Upload Finished',
    CreateNewFolderRequested = '[Create Folder] Create Folder Requested',
    DeleteItem = '[Delete Item] Delete Item From Folder',
    DownloadItem = '[Download Item] Download Item From Folder',
    DownloadItemCancelled = '[Download Item] Download Item Cancelled'

};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */

export class RetrieveFolderContents implements Action {
    readonly type = FileSystemActionTypes.RetrieveFolderContents;
    constructor(public payload: { folder: any }) {}

}

export class SaveRetrievedFolderContents implements Action {
    readonly type = FileSystemActionTypes.SaveRetrievedFolderContents;
    constructor(public payload: { contents: any }) {}

}

export class CreateNode implements Action {
    readonly type = FileSystemActionTypes.CreateNode;

    constructor(public payload: { node: any }) { }
}

export class FileUpload implements Action {
    readonly type = FileSystemActionTypes.FileUploadRequested;

    constructor(public payload: { id: string, path: string, data: any }) {}
}

export class CreateFolder implements Action {
    readonly type = FileSystemActionTypes.CreateNewFolderRequested;

    constructor(public payload: { id: string, path: string, data: any }) {}
}

export class FileUploadFinished implements Action {
    readonly type = FileSystemActionTypes.FileUploadFinished;
}

export class DeleteItem implements Action {
    readonly type = FileSystemActionTypes.DeleteItem;
    constructor(public payload: { id: string, path: string, items: string[] }) {}
}

export class DownloadItem implements Action {
    readonly type = FileSystemActionTypes.DownloadItem;
    constructor(public payload: { id: string, path: string, name: string }) {}
}

export class DownloadItemCancelled implements Action {
    readonly type = FileSystemActionTypes.DownloadItemCancelled;
    constructor(public payload: { id: string, path: string, name: string }) {}
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type FileSystemActions
    = RetrieveFolderContents
    | CreateNode
    | SaveRetrievedFolderContents
    | FileUpload
    | CreateFolder
    | DeleteItem
    | DownloadItem
    | DownloadItemCancelled;
    // | UpdateRetrievedFolderContents;
