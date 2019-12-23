import { Directive, ElementRef, Renderer2, OnChanges, OnInit, SimpleChanges, HostListener, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[gridEntity]'
})
export class GridEntityDirective implements OnInit, OnChanges {

  @Input() 
  public isSelected: boolean

  constructor(private element: ElementRef<HTMLDivElement>, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit() {}
  
  @HostListener('click', ['$event'])
  public setSelectionState(event: MouseEvent) {
    this.renderer.setStyle(this.element.nativeElement, 'background-color', 'rgba(19, 39, 126, 0.2)')
    const overlayElements = document.querySelectorAll('.ghost-button')

    overlayElements.forEach((element: HTMLElement) => element.style.display = this.isSelected ? 'inline-block' : 'none')
  }
  
}