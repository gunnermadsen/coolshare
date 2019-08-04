import { AccountActions, AccountActionTypes } from '../actions/account.actions';
import { initialAuthenticationState } from '@/core/authentication/store/reducer/authentication.reducer';

export interface AccountState {}

export const initialAccountState: AccountState = {}

export function AccountReducer(state = initialAccountState, action: AccountActions): AccountState {
    switch (action.type) {
        case AccountActionTypes.SaveAccountInfo:
            return action.payload;

        case AccountActionTypes.UpdateProfile:
            return {
                ...action.payload.profile
            }

        case AccountActionTypes.UpdatePicture:
            return {
                account: {
                    ...state,
                    ...action.payload.picture
                }
            }

        default:
            return state;
    }
}
