import { Directive, Input, isDevMode } from '@angular/core';

@Directive({
  selector: 'img[src]',
  host: {
    '[src]': 'checkPath(src)',
    '(error)': 'onError()'
  }
})
export class DefaultImageDirective {
  @Input() 
  public src: string;

  @Input() 
  public filename: string
  public defaultImg: string = '/icons/default.svg';
  private server: string

  constructor() {
    this.server = isDevMode() ? 'http://localhost:3000' : 'https://portfolioapis.herokuapp.com'
  }
  public onError() {
    const extension = this.filename.split('.').pop() || 'default'
    this.src = `${this.server}/icons/${extension}.svg`
  }
  public checkPath(src: string) {
    return src ? src : `${this.server}${this.defaultImg}`
  }
}