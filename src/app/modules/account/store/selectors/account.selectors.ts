import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as accountReducer from '../reducer/account.reducer';

export const selectAccountState = createFeatureSelector<accountReducer.AccountState>('Account');
export const accountSelector = createSelector(
    selectAccountState,
    account => {
        return account
    }
)
