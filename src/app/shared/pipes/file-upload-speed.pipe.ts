import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'uploadspeed'})
export class UploadSpeedPipe implements PipeTransform {
    transform(value: any): any {
    }
}