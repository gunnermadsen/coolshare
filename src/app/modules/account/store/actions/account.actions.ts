import { Action } from '@ngrx/store';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum AccountActionTypes {
    UpdateProfile = '[Account API] Update Profile',
    UpdatePicture = '[Account API] Update Picture',
    FetchAccountInfo = '[Account API] Fetch Account Info',
    SaveAccountInfo = '[Account Store] Save Account Info'
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class UpdateProfileAction implements Action {
    readonly type = AccountActionTypes.UpdateProfile;

    constructor(public payload: { profile: any, id: string }) { }
}

export class UpdatePictureAction implements Action {
    readonly type = AccountActionTypes.UpdatePicture;

    constructor(public payload: { picture: any }) { }
}

export class FetchAccountInfo implements Action {
    readonly type = AccountActionTypes.FetchAccountInfo;
}

export class SaveAccountInfo implements Action {
    readonly type = AccountActionTypes.SaveAccountInfo;

    constructor(public payload: any) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */

export type AccountActions
    = UpdateProfileAction
    | UpdatePictureAction
    | FetchAccountInfo
    | SaveAccountInfo;
