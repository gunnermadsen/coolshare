import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as authenticationReducer from '../reducer/authentication.reducer';

export const selectAuthenticationState = createFeatureSelector<authenticationReducer.AuthenticationState>('Auth');
export const selectUserAuthenticationStatus = createSelector(selectAuthenticationState, authStatus => authStatus.isLoggedIn)
export const selectUser = createSelector(selectAuthenticationState, authData => authData)
