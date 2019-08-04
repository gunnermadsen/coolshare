import { AuthenticationActionTypes, AuthenticationActions } from '../actions/authentication.actions';

export interface AuthenticationState {
    isLoggedIn: boolean;
    token: any
}

export const initialAuthenticationState: AuthenticationState = {
    isLoggedIn: false,
    token: undefined
};

export function AuthenticationReducer(state = initialAuthenticationState, action: AuthenticationActions): AuthenticationState {
    switch (action.type) {
        case AuthenticationActionTypes.AuthenticateUserSuccessful:
            return {
                isLoggedIn: true,
                token: action.payload.token
            }

        case AuthenticationActionTypes.LogoutUserRequested:
            return {
                isLoggedIn: false,
                token: undefined
            }

        default:
            return state;
    }
}
