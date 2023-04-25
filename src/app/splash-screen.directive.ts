import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appSplashScreen]'
})
export class SplashScreenDirective {

  constructor(private elementRef: ElementRef) {}
  get nativeElement() {
    return this.elementRef.nativeElement;
  }
}
