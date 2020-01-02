import { Directive, Input, isDevMode } from '@angular/core'

@Directive({
  selector: 'img[src]',
  host: {
    '[src]': 'checkPath(src)',
    '(error)': 'onError()'
  }
})
export class DefaultImageDirective {

  @Input() 
  public src: string

  @Input() 
  public filename: string

  public defaultImg: string = '/icons/default.svg'
  private server: string
  private onErrorServer: string

  constructor() {
    this.server = isDevMode() ? 'http://localhost:3000' : 'https://portfolioapis.herokuapp.com'
    this.onErrorServer = isDevMode() ? 'http://localhost:4200' : 'https://coolshare.herokuapp.com'
  }

  public onError() {
    const extension = this.filename.split('.').pop()
    this.src = `${this.onErrorServer}/assets/icons/${extension}.svg`
  }
  public checkPath(src: string) {
    return src ? src : `${this.server}${this.defaultImg}`
  }
}