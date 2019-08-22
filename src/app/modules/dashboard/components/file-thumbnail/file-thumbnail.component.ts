import { Component, OnInit, Input, ViewEncapsulation, OnChanges, SimpleChanges, ChangeDetectorRef, isDevMode } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@/reducers';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'file-thumbnail',
  templateUrl: './file-thumbnail.component.html',
  styleUrls: ['./file-thumbnail.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class FileThumbnailComponent implements OnInit, OnChanges {

  @Input() 
  public files: any

  @Input() 
  public mode: number

  public thumbnailGrid: object
  public thumbnailRow: object
  public gridItem: object
  public server: string

  constructor(public store$: Store<AppState>, private cdr: ChangeDetectorRef) {
    
  }

  ngOnChanges(changes: SimpleChanges) {

    this.thumbnailRow = {
      'display': 'flex',
      'flex-wrap': 'nowrap',
      'overflow-x': 'auto',
      '-webkit-overflow-scrolling': 'touch',
      '-ms-overflow-style': '-ms-autohiding-scrollbar'
    }

    this.thumbnailGrid = {
      'display': 'flex',
      'flex-wrap': 'wrap'
    }

    this.cdr.detectChanges()

  }

  ngOnInit() {
    this.server = isDevMode() ? 'http://localhost:3000' : 'https://portfolioapis.herokuapp.com'
  }


  public getUrl(uri: string): string {
    return `url('${this.server}${uri}')`
  }

  public setFlexItemState(): string {
    let style: string = (this.mode === 0) ? '1' : 'none'
    return style
  }

  public trackByFn<V, I>(value: V, index: I): V | I {
    return value
  }

}
