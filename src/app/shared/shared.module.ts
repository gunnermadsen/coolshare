import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FileSizePipe } from './pipes/file-size.pipe';
import { DropzoneDirective } from './directives/dropzone/dropzone.directive';
import { UploadSpeedPipe } from './pipes/file-upload-speed.pipe';
import { ShowIconControlsDirective } from './directives/show-icon-controls/show-icon-controls.directive';

@NgModule({
    declarations: [
        FileSizePipe,
        UploadSpeedPipe,
        DropzoneDirective,
        ShowIconControlsDirective
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        ToastrModule.forRoot({
            timeOut: 4000,
            positionClass: 'toast-bottom-right'
        }),
        RouterModule
    ],
    exports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        FileSizePipe,
        UploadSpeedPipe,
        DropzoneDirective,
        ShowIconControlsDirective
    ],
    providers: [],
})
export class SharedModule {}