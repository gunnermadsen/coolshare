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
    DeleteAction = '[Delete Item] Delete Item from Server',
    CreateNewFolderRequested = '[Create Folder] Create Folder Requested',
    DeleteFolderItems = '[Delete Items] Delete Items From Store',
    DeleteFolderItem = '[Delete Item] Delete Item From Store',
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

    constructor(public payload: { userId: string, path: string, data: any }) {}
}

export class CreateFolder implements Action {
    readonly type = FileSystemActionTypes.CreateNewFolderRequested;

    constructor(public payload: { id: string, path: string, data: any, userName: string }) {}
}

export class FileUploadFinished implements Action {
    readonly type = FileSystemActionTypes.FileUploadFinished;
}

export class DownloadItem implements Action {
    readonly type = FileSystemActionTypes.DownloadItem;
    constructor(public payload: { id: string, path: string, name: string }) {}
}

export class DownloadItemCancelled implements Action {
    readonly type = FileSystemActionTypes.DownloadItemCancelled;
    constructor(public payload: { id: string, path: string, name: string }) {}
}

export class DeleteFolderItems implements Action {
    readonly type = FileSystemActionTypes.DeleteFolderItems;
    constructor(public payload: { userId: string, path: string, items: string[], ids?: string[], id?: string, mode: number }) {}
}

export class DeleteFolderItem implements Action {
    readonly type = FileSystemActionTypes.DeleteFolderItem;
    constructor(public payload: { userId: string, path: string, items: string[], ids?: string[], id?: string, mode: number }) {}
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
    | DeleteFolderItems
    | DeleteFolderItem
    | DownloadItem
    | DownloadItemCancelled;
    // | UpdateRetrievedFolderContents;
