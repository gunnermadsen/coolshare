import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../environments/environment';
import { fileSystemReducer } from '../modules/dashboard/store/reducer/dashboard.reducer';
import { AuthenticationReducer } from '../core/authentication/store/reducer/authentication.reducer';
import { uploadReducer } from '@/modules/upload-file/store/reducer/upload.reducer';
import { AccountReducer } from '@/modules/account/store/reducer/account.reducer';
import { NotificationReducersMap } from '@/modules/notifications/notifications.module';


export interface AppState {

}

export const reducers: ActionReducerMap<AppState> = {
    Auth: AuthenticationReducer,
    Account: AccountReducer,
    fs: fileSystemReducer,
    upload: uploadReducer,
    Notifications: NotificationReducersMap
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];