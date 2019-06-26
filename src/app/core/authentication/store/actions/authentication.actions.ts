import { Action } from '@ngrx/store';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum AuthenticationActionTypes {
    RegisterUserRequested = '[Register User] Register User Requested',
    RegistrationSuccessful = '[Register User Successful] User Registration Succeeded',
    RegistrationUnsuccessful = '[Register User Unsuccessful] User Registration Unsuccessful',
    AuthenticateUserRequested = '[Authenticate User] Authenticate User Requested',
    AuthenticateUserSuccessful = '[Authenticate User Successful] User Authentication Successful',
    AuthenticateUserUnsuccessful = '[Authenticate User Unsuccessful] User Authentication Unsuccessful',
    LogoutUserRequested = '[Logout User] Logout User Requested'
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class RegisterUserRequested implements Action {
    readonly type = AuthenticationActionTypes.RegisterUserRequested;

    constructor(public payload: { user: any }) { }
}

export class RegistrationSuccessful implements Action {
    readonly type = AuthenticationActionTypes.RegistrationSuccessful;

    constructor(public payload: any) { }
}

export class RegistrationUnsuccessful implements Action {
    readonly type = AuthenticationActionTypes.RegistrationUnsuccessful;

    constructor(public payload: { error: any }) { }
}


export class AuthenticateUserRequested implements Action {
    readonly type = AuthenticationActionTypes.AuthenticateUserRequested;

    constructor(public payload: { account: any }) { }
}

export class AuthenticateUserSuccessful implements Action {
    readonly type = AuthenticationActionTypes.AuthenticateUserSuccessful;

    constructor(public payload: { account: any }) { }
}

export class AuthenticateUserUnsuccessful implements Action {
    readonly type = AuthenticationActionTypes.AuthenticateUserUnsuccessful;

    constructor(public payload: any) { }
}

export class LogoutUserRequested implements Action {
    readonly type = AuthenticationActionTypes.LogoutUserRequested;

}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type AuthenticationActions
    = RegisterUserRequested
    | RegistrationSuccessful
    | RegistrationUnsuccessful
    | AuthenticateUserRequested
    | AuthenticateUserSuccessful
    | AuthenticateUserUnsuccessful
    | LogoutUserRequested;
