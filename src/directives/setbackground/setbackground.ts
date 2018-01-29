import { Directive, Input, ElementRef } from '@angular/core';


@Directive({
  selector: '[setbackground]' // Attribute selector
})
export class SetbackgroundDirective {
  @Input('bg-image') backgroundImage: HTMLElement;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.el.nativeElement.style.backgroundImage = 'url(' + this.backgroundImage + ')';
  }

}
