import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export const toColumnsAnimation = [
  trigger('toColumnsAnimation', [
    state(
      'true',
      style({
        transform: 'translate({{leftPx}}px, {{topPx}}px)',
        left: '({{leftPx}}px',
      }),
      { params: { leftPx: 0, topPx: 0 } }
    ),
    transition('false => true', animate('1000ms ease-in')),
  ]),
];
