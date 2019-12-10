import { Directive, HostListener, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[showIconControls]'
})
export class ShowIconControlsDirective {

  @Input() 
  public menu: any

  // constructor(private element: ElementRef, private renderer: Renderer2) { }

  @HostListener('click', ['$event']) 
  private onClick($event): void {
    console.log($event)
  }

}
