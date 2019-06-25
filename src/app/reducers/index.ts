import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../environments/environment';
import { fileSystemReducer } from '../modules/dashboard/store/reducer/dashboard.reducer';
import { authenticationReducer } from '../core/authentication/store/reducer/authentication.reducer';


export interface AppState {

}

export const reducers: ActionReducerMap<AppState> = {
    fs: fileSystemReducer,
    auth: authenticationReducer
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];