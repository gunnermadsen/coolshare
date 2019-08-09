import { Action } from '@ngrx/store';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum FileSystemActionTypes {
    FS_READ_FOLDER = '[Get Folder Contents] Folder Contents Requested',
    FS_CREATE_FOLDER_ITEM = '[Save File] File Save Requested',
    FS_SAVE_RETRIEVED_FOLDER_CONTENTS = '[Saved Contents] Saved Retrieved Folder Contents',
    FS_UPLOAD_FILE = '[File Upload] Upload File to Repo',
    FS_UPDATE_FOLDER_CONTENTS = '[Update Folder Contents] Update Existing Contents',
    FS_CREATE_FOLDER = '[Create Folder] Create Folder Requested',
    FS_DELETE_FOLDER_ITEMS = '[Delete Items] Delete Items From Store',
    FS_DELETE_FOLDER_ITEM = '[Delete Item] Delete Item From Store',
    FS_DOWNLOAD_ITEM = '[Download Item] Download Item From Folder',
    FS_DOWNLOAD_ITEM_CANCELLED = '[Download Item] Download Item Cancelled'

};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */

export class RetrieveFolderContents implements Action {
    readonly type = FileSystemActionTypes.FS_READ_FOLDER;
    constructor(public payload: { folder: any }) {}

}

export class SaveRetrievedFolderContents implements Action {
    readonly type = FileSystemActionTypes.FS_SAVE_RETRIEVED_FOLDER_CONTENTS;
    constructor(public payload: { contents: any }) {}

}

export class FileUpload implements Action {
    readonly type = FileSystemActionTypes.FS_UPLOAD_FILE;

    constructor(public payload: { userId: string, path: string, data: any }) {}
}

export class CreateFolder implements Action {
    readonly type = FileSystemActionTypes.FS_CREATE_FOLDER;

    constructor(public payload: { id: string, path: string, data: any, userName: string }) {}
}

export class DownloadItem implements Action {
    readonly type = FileSystemActionTypes.FS_DOWNLOAD_ITEM;
    constructor(public payload: { path: string, name: string, id: string }) {}
}

export class DownloadItemCancelled implements Action {
    readonly type = FileSystemActionTypes.FS_DOWNLOAD_ITEM_CANCELLED;
    constructor(public payload: { id: string, path: string, name: string }) {}
}

export class DeleteFolderItems implements Action {
    readonly type = FileSystemActionTypes.FS_DELETE_FOLDER_ITEMS;
    constructor(public payload: { userId: string, path: string, items: string[], ids?: string[], id?: string, mode: number }) {}
}

export class DeleteFolderItem implements Action {
    readonly type = FileSystemActionTypes.FS_DELETE_FOLDER_ITEM;
    constructor(public payload: { userId: string, path: string, items: string[], ids?: string[], id?: string, mode: number }) {}
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type FileSystemActions
    = RetrieveFolderContents
    | SaveRetrievedFolderContents
    | FileUpload
    | CreateFolder
    | DeleteFolderItems
    | DeleteFolderItem
    | DownloadItem
    | DownloadItemCancelled;
