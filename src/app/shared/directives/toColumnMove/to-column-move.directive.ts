import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
} from '@angular/core';

@Directive({
  selector: '[appToColumnMove]',
})
export class ToColumnMoveDirective implements OnChanges {
  @Input() left: number;
  @Input() top: number;
  pulse: boolean;

  constructor(private element: ElementRef) {}

  @HostBinding('@toColumnsAnimation')
  get grow() {
    return { value: this.pulse, params: { left: this.left, top: this.top } };
  }

  ngOnChanges() {
    this.pulse = !this.pulse;
  }
}
