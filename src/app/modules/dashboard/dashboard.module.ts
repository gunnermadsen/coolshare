import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { DashboardRouter } from './dashboard.router.module';
import { SharedModule } from '@/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { fileSystemReducer } from './store/reducer/dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FileSystemEffects } from './store/effects/filesystem.effects';
import { NewFolderComponent } from './components/new-folder/new-folder.component';
import { UploadModule } from '../upload-file/upload.module';
import { FileActionsComponent } from './components/file-actions/file-actions.component';
import { FileSaverModule } from 'ngx-filesaver';

@NgModule({
    declarations: [
        DashboardComponent,
        MainComponent,
        RepositoryComponent,
        NewFolderComponent,
        FileActionsComponent

    ],
    imports: [
        CommonModule,
        SharedModule,
        DashboardRouter,
        UploadModule,
        StoreModule.forFeature('fs', fileSystemReducer),
        EffectsModule.forFeature([FileSystemEffects]),

        FileSaverModule
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