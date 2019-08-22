import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../environments/environment';
import { AuthenticationReducer } from '../core/authentication/store/reducer/authentication.reducer';
import { uploadReducer } from '@/modules/upload-file/store/reducer/upload.reducer';
import { AccountReducer } from '@/modules/account/store/reducer/account.reducer';
import { NotificationReducersMap } from '@/modules/notifications/notifications.module';
import { FileSystemReducerMap } from '@/modules/dashboard/dashboard.module';


export interface AppState {

}

export const reducers: ActionReducerMap<AppState> = {
    Auth: AuthenticationReducer,
    Account: AccountReducer,
    FileSystem: FileSystemReducerMap,
    upload: uploadReducer,
    Notifications: NotificationReducersMap
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];