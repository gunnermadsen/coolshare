import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { uploadReducer } from './store/reducer/upload.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UploadEffects } from './store/effects/upload.effects';
import { UploadProgressComponent } from './components/upload-progress/upload-progress.component';
import { SharedModule } from '@/shared/shared.module';
import { FileUploadProgressComponent } from './components/file-upload-progress/file-upload-progress.component';

@NgModule({
    declarations: [
        UploadProgressComponent,
        FileUploadProgressComponent

    ],
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature('upload', uploadReducer),
        EffectsModule.forFeature([UploadEffects])
    ],
    exports: [
        UploadProgressComponent,
        FileUploadProgressComponent
    ],
    entryComponents: [
        UploadProgressComponent,
        FileUploadProgressComponent
    ],
    providers: [],
})
export class UploadModule {}