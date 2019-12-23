import { NgModule } from '@angular/core';
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
import { AppState } from '@/reducers';
import { FileSystemSettingsReducer } from './store/reducer/settings.reducer';
import { RenameEntityComponent } from './components/rename-entity/rename-entity.component';
import { EntityInfoComponent } from './components/entity-info/entity-info.component';
import { EntityInfoDialogComponent } from './components/entity-info-dialog/entity-info-dialog.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { GridEntityDirective } from '@/shared/directives/grid-entity/grid-entity.directive';

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
        RenameEntityComponent,
        EntityInfoComponent,
        EntityInfoDialogComponent,
        BreadcrumbsComponent,

        GridEntityDirective

    ],
    imports: [
        SharedModule,
        DashboardRouter,
        StoreModule.forFeature('FileSystem', FileSystemReducerMap),
        EffectsModule.forFeature([FileSystemEffects]),
        
        FileSaverModule,
        NotificationsModule,
        UploadModule,
    ],
    exports: [
        RepositoryComponent,
        FileActionsComponent,
        StoreModule,
        EffectsModule
        
    ],
    entryComponents: [
        NewFolderComponent,
        RenameEntityComponent,
        EntityInfoDialogComponent
        // UploadDetailsComponent
    ],
    providers: [],
})
export class DashboardModule {}