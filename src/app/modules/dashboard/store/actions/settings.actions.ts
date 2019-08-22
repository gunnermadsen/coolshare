import { Action } from '@ngrx/store';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum FileSystemSettingsActionTypes {
    SAVE_SETTINGS = '[Filesystem API] Save Settings'
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class SaveRetrievedFolderSettings implements Action {
    readonly type = FileSystemSettingsActionTypes.SAVE_SETTINGS;

    constructor(public payload: { settings: any }) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type FileSystemSettingsActions
    = SaveRetrievedFolderSettings
