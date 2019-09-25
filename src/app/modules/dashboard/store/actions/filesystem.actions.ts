import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

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
    FS_DOWNLOAD_ITEM_CANCELLED = '[Download Item] Download Item Cancelled',
    FS_ADD_TO_FAVORITES = '[Star Item] Add To Favorites',
    FS_MODIFY_FAVORITE_STATUS = '[Modify Item] Modify Favorite State',
    FS_RENAME_ENTITY = '[Filesystem API] Rename Entity'

};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */

export class RetrieveFolderContents implements Action {
    readonly type = FileSystemActionTypes.FS_READ_FOLDER;
    constructor(public payload: { folder: any, id: string }) {}

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

    constructor(public payload: { userId: string, path: string, data: any, userName: string }) {}
}

export class DownloadItem implements Action {
    readonly type = FileSystemActionTypes.FS_DOWNLOAD_ITEM;
    constructor(public payload: { path: string, name: string, userId: string }) {}
}

export class DownloadItemCancelled implements Action {
    readonly type = FileSystemActionTypes.FS_DOWNLOAD_ITEM_CANCELLED;
    constructor(public payload: { id: string, path: string, name: string }) {}
}

export class DeleteFolderItems implements Action {
    readonly type = FileSystemActionTypes.FS_DELETE_FOLDER_ITEMS;
    constructor(public payload: any) {}
}

export class DeleteFolderItem implements Action {
    readonly type = FileSystemActionTypes.FS_DELETE_FOLDER_ITEM;
    constructor(public payload: any) {}
}
export class ModifyFavorites implements Action {
    readonly type = FileSystemActionTypes.FS_MODIFY_FAVORITE_STATUS;
    constructor(public payload: { entity: Update<any>, userId: string }) {}
}

export class RenameEntity implements Action {
    readonly type = FileSystemActionTypes.FS_RENAME_ENTITY;
    constructor(public payload: { entity: Update<any>, body: any }) {}
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
    | DownloadItemCancelled
    | ModifyFavorites
    | RenameEntity;
