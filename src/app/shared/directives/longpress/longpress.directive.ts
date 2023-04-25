import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';
import { GestureController } from '@ionic/angular';
import { fromEvent, merge, Observable, of, Subscription, timer } from 'rxjs';
import { debounceTime, filter, map, switchMap, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appLongPress]',
})
export class LongPressDirective implements AfterViewInit {

  @Output() mouseLongPress = new EventEmitter();
  @Input() delay = 500;
  action: any; //not stacking actions

  private longPressActive = false;

  constructor(
    private el: ElementRef,
    private gestureCtrl: GestureController,
    private zone: NgZone
  ) { }

  ngAfterViewInit() {
    this.loadLongPressOnElement();
  }

  loadLongPressOnElement() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      threshold: 0,
      gestureName: 'long-press',
      onStart: ev => {
        this.longPressActive = true;
        this.longPressAction(ev);
     
      },
      onEnd: ev => {
        this.longPressActive = false;
      }
    });
    gesture.enable(true);
  }

  private longPressAction(event) {
    if (this.action) {
      clearInterval(this.action);
    }
    this.action = setTimeout(() => {
      this.zone.run(() => {

        if (this.longPressActive === true) {
          this.longPressActive = false;
          this.mouseLongPress.emit(event);
        }
      });
    }, this.delay);
  }
}
