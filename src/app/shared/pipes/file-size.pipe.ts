import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(value: number, ...args: any[]): string {
    if (value > 0 && value < 1000) {
      return `${value} B`;
    } 
    else if (value > 1000 && value < 1000000) {
      return `${+(value / 1000).toFixed(2)} KB`;
    } 
    else if (value > 1000000 && value < 1000000000) {
      return `${+(value / 1000000).toFixed(2)} MB`;
    } 
    else if (value > 1000000000 && value < 1000000000000) {
      return `${+(value / 1000000000).toFixed(2)} GB`;
    }
  }

}
