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
