import { AuthenticationActionTypes, AuthenticationActions } from '../actions/authentication.actions';

export interface AuthenticationState {
    isLoggedIn: boolean;
    user: any
}

export const initialAuthenticationState: AuthenticationState = {
    isLoggedIn: false,
    user: undefined
};

export function authenticationReducer(state = initialAuthenticationState, action: AuthenticationActions): AuthenticationState {
    switch (action.type) {
        case AuthenticationActionTypes.AuthenticateUserSuccessful:
            return {
                isLoggedIn: true,
                user: action.payload.user
            }

        case AuthenticationActionTypes.LogoutUserRequested:
            return {
                isLoggedIn: false,
                user: undefined
            }

        default:
            return state;
    }
}
