import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { DashboardRouter } from './dashboard.router.module';
import { SharedModule } from '@/shared/shared.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { FileSystemReducer } from './store/reducer/repository.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FileSystemEffects } from './store/effects/filesystem.effects';
import { NewFolderComponent } from './components/new-folder/new-folder.component';
import { UploadModule } from '../upload-file/upload.module';
import { FileActionsComponent } from './components/file-actions/file-actions.component';
import { FileSaverModule } from 'ngx-filesaver';
import { NotificationsModule } from '../notifications/notifications.module';
import { FileThumbnailComponent } from './components/file-thumbnail/file-thumbnail.component';
import { AppState } from '@/reducers';
import { FileSystemSettingsReducer } from './store/reducer/settings.reducer';

export const FileSystemReducerMap: ActionReducerMap<AppState> = {
    Content: FileSystemReducer,
    Settings: FileSystemSettingsReducer
}

@NgModule({
    declarations: [
        DashboardComponent,
        MainComponent,
        RepositoryComponent,
        NewFolderComponent,
        FileActionsComponent,
        FileThumbnailComponent
        
    ],
    imports: [
        CommonModule,
        SharedModule,
        DashboardRouter,
        UploadModule,
        StoreModule.forFeature('FileSystem', FileSystemReducerMap),
        EffectsModule.forFeature([FileSystemEffects]),

        FileSaverModule,
        NotificationsModule
    ],
    exports: [
        RepositoryComponent,
        FileActionsComponent,
        StoreModule,
        EffectsModule
        
    ],
    entryComponents: [
        NewFolderComponent,
        // UploadDetailsComponent
    ],
    providers: [],
})
export class DashboardModule {}