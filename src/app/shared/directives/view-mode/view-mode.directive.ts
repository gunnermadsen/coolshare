import { Directive, Input, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[viewMode]',
  
})
export class ViewModeDirective implements OnChanges {

  @Input() 
  public mode: number

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {
    switch (changes.mode.currentValue) {
      case 0:
        this.renderer.setStyle(this.element.nativeElement, 'grid-template-rows', '60px auto')
        break 
      case 1:
        this.renderer.removeStyle(this.element.nativeElement, 'grid-template-rows')
        break 
    }
  }
}
