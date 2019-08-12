import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UploadModule } from '@/modules/upload-file/upload.module';
import { FileSizePipe } from './pipes/file-size.pipe';

@NgModule({
    declarations: [
        FileSizePipe

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
        FileSizePipe
    ],
    providers: [],
})
export class SharedModule {}