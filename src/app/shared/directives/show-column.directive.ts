import { Directive, ElementRef, Input, AfterViewInit, Renderer2 } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Directive({ 
     selector: '[showColumn]' 
})
export class ShowColumnDirective implements AfterViewInit {
    @Input() private showContent: boolean;

    private state: string

    constructor(private element: ElementRef, private breakpointObserver: BreakpointObserver, private renderer: Renderer2) { 
        this.breakpointObserver.observe('(max-width: 500px)').subscribe((state: BreakpointState) => {
            this.state = state.matches ? 'hidden' : 'table-cell';
            console.log(this.state)
        })
        // this.state = this.showContent ? 'hidden' : 'table-cell'
    }

    ngAfterViewInit(): void {
        this.renderer.setStyle(this.element.nativeElement, 'display', this.state)
        // this.element.nativeElement.style.display = this.showInput;
    }
}