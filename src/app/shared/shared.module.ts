import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UploadModule } from '@/modules/upload-file/upload.module';
import { FileSizePipe } from './pipes/file-size.pipe';
import { DropzoneDirective } from './directives/dropzone.directive';
import { UploadSpeedPipe } from './pipes/file-upload-speed.pipe';

@NgModule({
    declarations: [
        FileSizePipe,
        UploadSpeedPipe,
        DropzoneDirective
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
        MaterialModule,
        ReactiveFormsModule,
        FileSizePipe,
        UploadSpeedPipe,
        DropzoneDirective
    ],
    providers: [],
})
export class SharedModule {}