import { Attribute, Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[check-visibility]',
})
export class CheckVisibilityDirective implements OnInit {

  constructor(private elementRef: ElementRef,
    @Attribute('control') public control: string) { }

  ngOnInit(): void {
  }
}
