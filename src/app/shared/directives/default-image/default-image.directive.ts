import { Directive, Input, isDevMode } from '@angular/core';

@Directive({
  selector: 'img[src]',
  host: {
    '[src]': 'checkPath(src)',
    '(error)': 'onError()'
  }
})
export class DefaultImageDirective {
  @Input() src: string;
  public defaultImg: string = '/assets/icons/file-13.png';
  private server: string

  constructor() {
    this.server = isDevMode() ? 'http://localhost:4200' : 'https://coolshare.herokuapp.com'
  }
  public onError() {
    this.src = `${this.server}${this.defaultImg}`
  }
  public checkPath(src) {
    return src ? src : `${this.server}${this.defaultImg}`
  }
}