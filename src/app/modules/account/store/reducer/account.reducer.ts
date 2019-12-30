import { createReducer, on, Action } from '@ngrx/store';
import * as AccountActions from '../actions/account.actions'
export interface AccountState {}

export const initialAccountState: AccountState = {}

const reducer = createReducer(
    initialAccountState, 
    on(AccountActions.saveProfileInfoAction, (state: AccountState, { profile }) => {
        return profile
    }),
    on(AccountActions.updateProfileAction, (state: AccountState, { profile }) => {
        return {
            ...profile
        }
    }),
    on(AccountActions.updateProfilePictureAction, (state: AccountState, { profile }) => {
        return {
            account: {
                ...state,
               picture: profile.picture
            }
        }
    })
)

export function AccountReducer(state: AccountState | undefined, action: Action) {
    return reducer(state, action)
}
