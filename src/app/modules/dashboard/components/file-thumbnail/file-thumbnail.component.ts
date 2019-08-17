import { Component, OnInit, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@/reducers';


@Component({
  selector: 'file-thumbnail',
  templateUrl: './file-thumbnail.component.html',
  styleUrls: ['./file-thumbnail.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class FileThumbnailComponent implements OnInit, OnChanges {

  @Input() 
  public files: any;

  @Input() 
  public mode: number;

  public thumbnailGrid: object
  public thumbnailRow: object
  public gridItem: object

  constructor(public store$: Store<AppState>) {
    
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

  }

  ngOnInit() {
    
  }


  public getUrl(url: string): string {
    return `url('${url}')`
  }

  public setFlexItemState(): string {
    let style: string = (this.mode === 0) ? '1' : 'none'
    return style
  }

}
