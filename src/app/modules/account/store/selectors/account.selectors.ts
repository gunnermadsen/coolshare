import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import * as accountReducer from '../reducer/account.reducer';

export const selectAccountState = createFeatureSelector<accountReducer.AccountState>('Account');
export const accountSelector = createSelector(
    selectAccountState,
    account => {
        return account
    }
)

export const selectUserName: MemoizedSelector<object, any> = createSelector(
    selectAccountState,
    (account: any) => {
        return account.UserName
    }
)

export const selectAccountInfo: MemoizedSelector<object, any> = createSelector(
    selectAccountState,
    (account: any) => account
)

export const selectInitialsFromAccountInfo: MemoizedSelector<object, any> = createSelector(
    selectAccountState,
    (account: any) => {

        if (!Object.keys(account).length) return

        if (account.FirstName && account.LastName) {
            const fullName: string[] = `${account.FirstName} ${account.LastName}`.split(" ")
            return `${fullName[0][0]}${fullName[1][0]}`
            
        }
        else {
            return account.UserName[0]
        }

    }
)
