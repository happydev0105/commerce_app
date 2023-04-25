import { Component, Input, OnInit, OnChanges, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { format } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from 'src/app/core/services/utils/utils.service';

@Component({
  selector: 'app-time-selector',
  templateUrl: './time-selector.component.html',
  styleUrls: ['./time-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeSelectorComponent implements OnInit, OnChanges {

  @Input() availableStartHour: string;
  @Input() availableEndHour: string;
  @Input() initialHour: string;
  @Input() initialMinutes: string;
  @Input() isEnd = false;
  @Input() endedHour: string;
  @Input() endedMinutes: string;
  @Output() hourSelectedEmitter: EventEmitter<string> = new EventEmitter<string>();

  hourCollection: string[] = [];
  minuteCollection: BehaviorSubject<string[]> = new BehaviorSubject([]);

  hourSelected = '';
  minuteSelected = '';

  constructor(
    private utilsService: UtilsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnChanges() {

    this.hourCollection = this.utilsService.generateHours(this.availableStartHour, this.availableEndHour);
    if (this.hourSelected === this.endedHour) {
      const minuteIndex = this.getIndexByMinute(this.endedMinutes);
      this.setMinuteCollectionByIndex(minuteIndex);
    }else{
      this.minuteCollection.next(this.utilsService.generateMinutes());

    }
    this.hourSelected = this.hourCollection[this.getInitialHourSlide()];
    this.minuteSelected = this.minuteCollection.value[this.getInitialMinutesSlide()];
  }

  ngOnInit() { }

  onSlideChange(event) {
    const activeSlide: HTMLElement = event[0].slides[event[0].activeIndex];
    if (activeSlide) {
      if (event[0].el.classList.contains('hours')) {
        this.hourSelected = activeSlide.children[0].attributes[1].value;
        if (this.isEnd) {
            if (this.hourSelected === this.endedHour) {
            const minuteIndex = this.getIndexByMinute(this.endedMinutes);
            this.setMinuteCollectionByIndex(minuteIndex);
          } else {
            this.minuteCollection.next([...this.utilsService.generateMinutes()]);
            this.cd.detectChanges();
          }
        }
      } else if (event[0].el.classList.contains('minutes')) {
        this.minuteSelected = activeSlide.children[0].attributes[1].value;
      }
    }
    this.hourSelectedEmitter.emit(`${this.hourSelected}:${this.minuteSelected}`);
  }

  getIndexByHour(currentHour: string): number {
    const findIndex = this.hourCollection.findIndex(hour => hour === currentHour);
    return findIndex < 0 ? 0 : findIndex;
  }

  getIndexByMinute(currentMinutes: string): number {

    const findIndex = this.minuteCollection.value.findIndex(minute => minute === currentMinutes);
    return findIndex < 0 ? 0 : findIndex;
  }

  setMinuteCollectionByIndex(minuteIndex: number) {
    const minuteCollectionBK = this.minuteCollection.value;

    this.minuteCollection.next([]);
    this.minuteCollection.next(minuteCollectionBK.slice(0, minuteIndex + 1));

    this.cd.detectChanges();
  }

  getInitialHourSlide(): number {
    const currentHour = this.initialHour ? Number.parseInt(this.initialHour, 10).toString() : format(new Date(), 'H');
    const findIndex = this.hourCollection.findIndex(hour => hour === currentHour);
    return findIndex < 0 ? 0 : findIndex;
  }

  getInitialMinutesSlide(): number {

    const roundNearest5 = (num: number) => Math.round(num / 5) * 5;

    let index = 0;
    const currentMinutes = this.initialMinutes ? this.initialMinutes : format(new Date(), 'mm');
    const findIndex = this.minuteCollection.value.find(minute => {
      const roundedMinute = roundNearest5(Number.parseInt(minute, 10));
      return roundedMinute === roundNearest5(Number.parseInt(currentMinutes, 10));
    });
    if (findIndex) {
      index = this.minuteCollection.value.findIndex(item => item === findIndex);
    }
    return index;
  }

}
