import { Directive, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: 'dropzone',
})
export class DropzoneDirective {

    @Output() onFileDropped: EventEmitter<any> = new EventEmitter<any>()

    @HostBinding('style.background-color') private background: string = '#F5FCFF'
    @HostBinding('style.opacity') private opacity: string = '1'

    constructor() { }

    @HostListener('dragover', ['$event']) 
    public onDragOver(event: DragEvent) {
        event.preventDefault()
        event.stopPropagation()

        this.background = '#9ECBEC'
        this.opacity = '0.8'
    }

    @HostListener('drop', ['$event']) 
    public onDrop(event: DragEvent) {
        event.preventDefault()
        event.stopPropagation()

        this.background = '#F5FCFF'
        this.opacity = '1'

        let files = event.dataTransfer.files

        if (files.length) {
            this.onFileDropped.emit(files)
        }
    }

}