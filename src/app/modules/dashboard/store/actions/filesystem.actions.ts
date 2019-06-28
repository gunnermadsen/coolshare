import { Action } from '@ngrx/store';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum FileSystemActionTypes {
    RetrieveFolderContents = '[Get Folder Contents] Folder Contents Requested',
    CreateNode = '[Save File] File Save Requested',
    SaveRetrievedFolderContents = '[Saved Contents] Saved Retrieved Folder Contents'
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

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type FileSystemActions
    = RetrieveFolderContents
    | CreateNode
    | SaveRetrievedFolderContents;
