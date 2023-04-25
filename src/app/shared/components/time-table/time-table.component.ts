/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
import { OnDestroy } from '@angular/core';
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Booking } from 'src/app/core/models/reservation.model';
import { TimeTable } from 'src/app/core/models/time-table.model';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { CardsPosition } from 'src/app/core/interfaces/card-reservation.interface';
import { MoveEvent } from 'src/app/core/interfaces/move-event.interface';
import { Position } from 'src/app/core/interfaces/position.interface';
import {
  addDays,
  addMinutes,
  areIntervalsOverlapping,
  format,
  getHours,
  getMinutes,
  intervalToDuration,
  isAfter,
  isBefore,
  isPast,
} from 'date-fns';
import { IonContent, Platform } from '@ionic/angular';
import { Time } from '@angular/common';
import { DateService } from 'src/app/core/utils/date.service';
import { DayModel } from 'src/app/core/models/day.model';
import { EColors } from 'src/app/core/enums/colors.enum';
import { Longpress } from 'src/app/core/interfaces/longpress.interface';
import { EditBooking } from 'src/app/core/utils/editBooking.service';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { uniqWith, isEqual } from 'lodash';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { log } from 'console';

gsap.registerPlugin(Draggable);

interface ISharingColumn {
  bookingA: string;
  bookingB: string;
  column: string;
}

interface IBookingTime {
  uuid: string;
  time: Time;
}

interface IsOverlap {
  booking: Booking[];
}

type EmployeeOverlapping = {
  asignedToUuid: string;
  bookings: Booking[][];
};

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeTableComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('draggableZone', { static: true }) draggableZone: ElementRef;

  @Input() public timetable: TimeTable;
  @Input() public selectedDate: DayModel;
  @Input() public isToday: boolean;

  @Output() navigateTo: EventEmitter<{ book: Booking; isBooking: boolean }> =
    new EventEmitter();

  @Output() updateBooking: EventEmitter<Booking> = new EventEmitter<Booking>();
  @Output() longPressAction: EventEmitter<Longpress> =
    new EventEmitter<Longpress>();
  @Output() editBooking: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() overscrollEmitter: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() overscrollEndEmitter: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  first: MoveEvent;
  $position: BehaviorSubject<MoveEvent>;
  dragPosition: Position[] = [];
  $reservations: BehaviorSubject<Booking[]> = new BehaviorSubject([]);
  $freeTime: BehaviorSubject<Booking[]> = new BehaviorSubject([]);
  $editedBookingPosition: BehaviorSubject<CardsPosition> = new BehaviorSubject(
    null
  );
  $actualHour: BehaviorSubject<number> = new BehaviorSubject(0);
  allOverlappedBookingsCollection: Booking[][] = [];
  resizeItem: Booking;
  isGhosting = false;
  ghostingData = null;
  isOverlapCollection: IsOverlap[] = [];
  isReady = false;
  columnWidth: number;
  viewHeight: number;
  time: Time;
  sharedColumn: ISharingColumn[] = [];
  bookingTime;
  draggableItem: string = null;
  isEditting = false;
  eColor = EColors;
  isScrolling = false;
  timer;
  touchduration = 500; //length of time we want the user to touch before we do something
  draggableDiv: HTMLElement;
  oldOverlap: Booking[] = [];
  intervalGoUp;
  intervalGoDown;
  isBeingAutoScrolled = false;
  deviceHieght: number;
  bookingTimeCollection: IBookingTime[] = [];
  isDragging = false;
  draggingBooking: Booking = null;
  draggingData: { uuid: string; time: string };
  draggableInstance: Draggable[];
  tableWidth: string;
  dragWidth: string;
  isHorizontal = true;
  isVertical = true;
  firstXValue: number;
  firstYValue: number;
  event = null;
  containerHeight: number;
  leftByPlatform: string;
  leftByPlatformValue: number;
  isOverlapEnabled = true;
  overscroll: boolean;
  startY: number;
  styleSheet: CSSStyleSheet;
  styleEl: HTMLStyleElement;
  subscription: Subscription = new Subscription();
  rowHeight = 50; // Set a fixed row height in pixels
  numRows: number;
  gridTemplateRows: string;
  constructor(
    public scroll: ScrollDispatcher,
    public dateService: DateService,
    private editBookingService: EditBooking,
    private screenOrientation: ScreenOrientation,
    private cdr: ChangeDetectorRef,
    private platform: Platform
  ) {
    this.first = {
      delta: {
        x: 0,
        y: 0,
      },
      distance: {
        x: 0,
        y: 0,
      },
      id: null,
    };
    this.$position = new BehaviorSubject<MoveEvent>(this.first);
    this.dragPosition = [];
    this.deviceHieght = this.platform.height();
    if (this.platform.is('ios')) {
      this.containerHeight = window.innerHeight - 273.5;
      this.leftByPlatform = '39px';
      this.leftByPlatformValue = 39;
    } else {
      this.containerHeight = window.innerHeight - 198.5;
      this.leftByPlatform = '30px';
      this.leftByPlatformValue = 30;
    }
  }

  @HostListener('touchstart', ['$event']) // prevent long press on scroll
  onTouchStart(ev: any) {
    this.event = ev;
    this.overscroll = false;
    this.startY = ev.touches[0].pageY;
  }

  @HostListener('touchmove', ['$event'])
  onScroll(e: any) {
    this.isScrolling = true;
    const y = e.touches[0].pageY;
    // START DETECTED SCROLL DIRECTION
    if (this.event) {
      if (
        !this.isHorizontal ||
        e.touches[0].pageY > this.event.touches[0].pageY + 100 ||
        e.changedTouches[0].pageY < this.event.changedTouches[0].pageY - 100
      ) {
        this.isVertical = true;
        this.isHorizontal = false;
      } else if (
        !this.isVertical ||
        e.touches[0].pageX > this.event.touches[0].pageX + 50 ||
        e.changedTouches[0].pageX < this.event.changedTouches[0].pageX - 50
      ) {
        this.isVertical = false;
        this.isHorizontal = true;
      }
    }
    // END DETECTED SCROLL DIRECTION
    if (
      document.querySelector('#container').scrollTop === 0 &&
      y > this.startY + 192 &&
      this.draggableItem === null &&
      !this.isGhosting
    ) {
      this.overscroll = true;
      this.overscrollEmitter.emit(this.overscroll);
    }
  }

  @HostListener('touchend', ['$event']) // set
  onTouchEnd() {
    this.isScrolling = false;
    this.event = null;
    this.isVertical = true;
    this.isHorizontal = true;
    if (this.overscroll && this.draggableItem === null && !this.isGhosting) {
      this.overscrollEndEmitter.emit(true);
      this.overscroll = false;
    }
  }
  checkScreenOrientation() {
    this.subscription.add(
      this.screenOrientation.onChange().subscribe((res) => {})
    );
  }
  scrollLeft(value) {
    const elem = document.getElementById('container');
    elem.scrollLeft = value;
  }

  scrollToTimeline(value) {
    const elem = document.getElementById('container');
    elem.scrollTop = value - 150;
  }

  ionViewVillEnter() {}

  ngOnInit(): void {
    this.editBookingConfirmation();
    this.modalOpened();
    this.draggableItem = null;
    this.isGhosting = false;
    this.isEditting = false;
    this.checkScreenOrientation();
  }

  ngAfterViewInit(): void {
    this.setEqualHeightForDivs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.timetable?.currentValue !== null) {
      this.allOverlappedBookingsCollection = [];
      this.isReady = false;
      this.draggableItem = null;
      this.isOverlapEnabled = true;
      this.tableWidth = this.timetable.tableWidth;
      this.dragWidth = this.timetable.draggableWidth;
      this.columnWidth = this.timetable.columnWidth;
      localStorage.setItem('columnWidth', `${this.columnWidth}`);
      localStorage.setItem('tableWidth', `${this.tableWidth}`);
      localStorage.setItem('tableWidth', `${this.tableWidth}`);
      this.isGhosting = false;
      this.isEditting = false;

      this.editBooking.emit(false);

      this.draggableInstance = null;
      this.fillCardsPosition(this.timetable?.bookings);
      this.fillFreetimePosition(this.timetable?.freeTime);
      this.setFirstFreeTimeSize(this.timetable.freeTime);
      this.setFirstSize(this.timetable.bookings);
      const minute = 60000;
      const $timer = timer(0, minute);
      this.$actualHour.next(null);
      this.$actualHour.next(this.setActualTimeInPixels(this.timetable));
      this.subscription.add(
        $timer.subscribe((value: number) => {
          if (value < 1) {
            if (this.isToday) {
              this.scrollToTimeline(this.$actualHour.value);
            }
          }
        })
      );
      this.setEqualHeightForDivs();
    }
  }

  modalOpened() {
    this.subscription.add(
      this.editBookingService.modalOppened.subscribe((res: boolean) => {
        if (!res && this.isGhosting) {
          this.removeGhost();
          this.isGhosting = false;
          this.isEditting = false;
          this.draggableItem = null;
        }
      })
    );
  }

  removeGhost() {
    this.$reservations.next(
      this.$reservations.value.filter((item: Booking) => item.uuid !== 'ghost_')
    );
  }

  createDraggable(isGhost: boolean, isFromResize = false) {
    console.log(this.draggingBooking);

    const self = this;
    const gridWidth = this.columnWidth;
    const gridHeight = 8;
    const gridRows = this.timetable.timeFrames.length * 3;
    const gridColumns = this.timetable.employees.length;
    const liveSnap = true;
    const overlapThreshold = '5%';
    let height: number;
    isFromResize
      ? (height = this.timetable.timeFrames.length * 24)
      : (height =
          this.timetable.timeFrames.length * 24 -
          this.draggingBooking.mobileSize.height);

    this.draggableInstance = Draggable.create('.draggableItem', {
      bounds: '#tbody',
      edgeResistance: 1,
      type: 'x,y',
      allowNativeTouchScrolling: true,
      zIndexBoost: false,
      inertia: true,
      autoScroll: 1,
      liveSnap: true,
      dragClickables: false,
      onDragStart(start) {
        self.draggingBooking.mobileSize.width = this.columnWidth;
        gsap.set(`._${self.draggingBooking.uuid}`, {
          width: gridWidth,
          left: 0,
        });
      },
      onDrag(move) {
        if (self.draggingBooking !== undefined) {
          self.isDragging = true;
          self.draggingData = self.realTimeHourByPostion(this.endY);
          self.cdr.detectChanges();
        }
      },
      onDragEnd(e) {
        const newCardPosition: CardsPosition = new CardsPosition();
        const uuid = isGhost ? 'ghost_' : self.draggingBooking.uuid;
        const elem = document.getElementById(uuid);
        const style = window.getComputedStyle(elem);
        const matrix = new WebKitCSSMatrix(style.transform);

        newCardPosition.uuid = uuid;
        const position: Position = {
          x: matrix.m41,
          y: this.endY,
        };
        if (self.isDragging) {
          if (this.endY >= 0) {
            self.newhourByPosition(uuid, this.endY, isGhost);
          }

          newCardPosition.position = position;
          self.setNewPositionFGhost(newCardPosition);
        }
        if (isGhost) {
          const index = matrix.m41 / self.columnWidth;
          if (this.endX !== undefined) {
            self.ghostingData.employee =
              self.timetable.employees[index.toFixed(0)];
          }

          self.longPressAction.emit(self.ghostingData);
          self.draggableInstance.map((item: Draggable) => item.kill());
        }
        self.isDragging = false;
        self.cdr.detectChanges();
      },
      snap: {
        x(endValue) {
          return liveSnap
            ? Math.round(endValue / gridWidth) * gridWidth
            : endValue;
        },
        y(endValue) {
          return liveSnap
            ? Math.round(endValue / gridHeight) * gridHeight
            : endValue;
        },
      },
    });
  }

  getDraggableInstanceIndexByUuid(uuid: string): number {
    return this.draggableInstance.findIndex(
      (instance: Draggable) => instance.target.id === uuid
    );
  }

  setEqualHeightForDivs() {
    const cardsDiv = document.getElementById('draggableZone');
    const containerDiv = document.getElementById('container');
    const timeline = document.getElementById('timeline');
    if (timeline) {
      timeline.style.width = `${
        this.timetable.employees.length * this.columnWidth
      }px`;
    }
    if (cardsDiv) {
      cardsDiv.style.height = `${this.timetable.timeFrames.length * 24}px`;

      this.viewHeight = this.timetable.timeFrames.length * 24;
    }
  }

  formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  public realTimeHourByPostion(yValue): { uuid: string; time: string } {
    if (this.draggingBooking) {
      let time: Time;
      if (yValue === 0) {
        time = {
          hours: parseInt(this.timetable.timeFrames[0].label.split(':')[0], 10),
          minutes: parseInt(
            this.timetable.timeFrames[0].label.split(':')[1],
            10
          ),
        };
      } else {
        time = this.calculateHourByPixel(yValue / 24, this.timetable);
      }
      const bookingTime: IBookingTime = {
        uuid: this.draggingBooking.uuid,
        time,
      };
      const timeStr = this.dateService.formatBookingTimetable(
        bookingTime.time.hours,
        bookingTime.time.minutes,
        this.draggingBooking.duration
      );
      return { uuid: this.draggingBooking.uuid, time: timeStr };
    }
  }

  public newhourByPosition(uuid: string, yValue: number, isGhost: boolean) {
    const time = this.calculateHourByPixel(yValue / 24, this.timetable);
    const bookingTime: IBookingTime = {
      uuid,
      time,
    };
    if (isGhost) {
      this.ghostingData.selectedHour = {
        hours: bookingTime.time.hours,
        minutes: bookingTime.time.minutes,
      };
    }
    /*  this.$reservations.value.map((book: Booking) => {
       if (book.uuid === uuid) {
         book.startsHour = bookingTime.time.hours;
         book.startsMinute = bookingTime.time.minutes;
         return book;
       }
     }); */
    this.hourByPosition(uuid);
  }
  public hourByPosition(uuid: string) {
    const elementChild = document.getElementById(uuid);

    const elementParent = document.getElementById('draggableZone');
    const domRectChild = elementChild?.getBoundingClientRect();
    const domRectParent = elementParent?.getBoundingClientRect();
    const relativePos = domRectChild.top - domRectParent.top;
    const time = this.calculateHourByPixel(relativePos / 24, this.timetable);
    const bookingTime: IBookingTime = {
      uuid,
      time,
    };
    this.$reservations.value.map((book: Booking) => {
      if (book.uuid === uuid) {
        book.startsHour = bookingTime.time.hours;
        book.startsMinute = bookingTime.time.minutes;
        return book;
      }
      this.cdr.detectChanges();
    });
    this.cdr.detectChanges();
  }

  public openBooking(booking: Booking, isBooking: boolean) {
    if (this.draggableItem === null && !booking.isGhost) {
      this.navigateTo.emit({ book: booking, isBooking });
    }
  }

  calculateHourByPixel(value: number, timetable: TimeTable): Time {
    const time: Time = {
      hours: 0,
      minutes: 0,
    };
    if (value >= 0) {
      const index = parseInt(value.toString().split('.')[0], 10);
      const hour = timetable.timeFrames[index];
      time.hours = parseInt(hour.label.split(':')[0], 10);
      time.minutes =
        parseInt(hour.label.split(':')[1], 10) +
        Math.round((value - Math.floor(value)) / 0.3) * 5;

      if (time.minutes === 60) {
        time.hours === 23 ? (time.hours = 0) : (time.hours += 1);
        time.minutes = 0;
      }
    }

    return time;
  }

  setActualTimeInPixels(timetable: TimeTable): number {
    const initialTimetableHour = parseInt(
      timetable.timeFrames[0].label.split(':')[0],
      10
    );
    const initialTimetableMinute = parseInt(
      timetable.timeFrames[0].label.split(':')[1],
      10
    );
    const actualHour = getHours(new Date());
    const actualMin = getMinutes(new Date());
    const pixelsInHour = (actualHour - initialTimetableHour) * 96;
    const pixelsInMin =
      (Math.ceil(actualMin - initialTimetableMinute) * 96) / 60;
    const totalPixels = pixelsInHour + pixelsInMin;
    return totalPixels + 50;
  }

  newCheckOverlap(id: string) {
    // cogemos las reserva seleccionada
    const bookingSelected = this.$reservations.value.find(
      (item) => item.uuid === id
    );
    if (bookingSelected) {
      // cogemos las coordenadas de la booking seleccionada
      const y2 = bookingSelected.mobilePosition.y;
      const h2 = bookingSelected.mobileSize.height;
      const t2 = y2 + h2;
      const bookingOverlap = this.$reservations.value.filter((item) => {
        const h1 = item.mobileSize.height;
        const y1 = item.mobilePosition.y;
        const t1 = h1 + y1;
        if (
          item.uuid !== bookingSelected.uuid &&
          item.mobilePosition.x === bookingSelected.mobilePosition.x
        ) {
          if (y1 <= y2 && y2 < t1) {
            item.isOverlapped = true;

            return true;
          } else if (y1 > y2 && y1 < t2) {
            item.isOverlapped = true;
            return true;
          }
        }

        return false;
      });

      if (bookingOverlap.some((item) => this.oldOverlap.includes(item))) {
        this.oldOverlap = bookingOverlap;
        this.oldOverlap.push(bookingSelected);
      } else if (bookingOverlap.length > 0) {
        this.oldOverlap = bookingOverlap;
        this.oldOverlap.push(bookingSelected);
      } else {
        this.oldOverlap = this.oldOverlap.filter(
          (item) => item.uuid !== bookingSelected.uuid
        );
        this.oldOverlap.forEach((item, index) => {
          item.isOverlapped = true;
        });
      }
      this.allOverlappedBookingsCollection.push(this.oldOverlap);
    }

    const byEmployee = [
      ...this.convertToEmployeeOverlapping(
        this.allOverlappedBookingsCollection
      ),
    ];

    byEmployee.forEach((item: EmployeeOverlapping) => {
      this.resizeCards2(
        this.addIsMultipleProperty(
          this.groupOverlappingBookings(
            Array.from(
              new Set([
                ...item.bookings
                  .flat()

                  .sort((a: Booking, b: Booking) =>
                    a.duration < b.duration ? 1 : -1
                  ),
              ])
            )
          )
        )
      );
    });

    this.cdr.detectChanges();
  }

  addIsMultipleProperty(groupedReservations: Booking[][]): Booking[][] {
    const reservationsWithIsMultiple: Booking[][] = [];

    groupedReservations.forEach((group) => {
      const updatedGroup: Booking[] = [];

      group.forEach((reservation, index) => {
        const otherReservations = group.filter((_, i) => i !== index);
        const isMultiple = otherReservations.every((otherReservation) =>
          this.isOverlapping(reservation, otherReservation)
        );
        const overlapCount = otherReservations.filter((otherReservation) =>
          this.isOverlapping(reservation, otherReservation)
        ).length;
        updatedGroup.push({
          ...reservation,
          isMultiple,
          overlapCount,
        });
      });

      reservationsWithIsMultiple.push(updatedGroup);
    });
    if (this.checkIfCanExistMultiple(reservationsWithIsMultiple)) {
      return reservationsWithIsMultiple;
    }
    return [];
  }
  checkIfCanExistMultiple(booking: Booking[][]): boolean {
    return booking.flat().some((book) => book.isMultiple);
  }
  toMinutes(booking: Booking): number {
    return (
      parseInt(booking.startsDay, 10) * 24 * 60 +
      booking.startsHour * 60 +
      booking.startsMinute
    );
  }
  isOverlapping(a: Booking, b: Booking): boolean {
    const aStart = this.toMinutes(a);
    const aEnd = aStart + a.duration;
    const bStart = this.toMinutes(b);
    const bEnd = bStart + b.duration;

    return aStart < bEnd && bStart < aEnd;
  }

  convertToEmployeeOverlapping(bookings: Booking[][]): EmployeeOverlapping[] {
    const overlapping: { [key: string]: Booking[][] } = {};

    bookings.forEach((bookingGroup) => {
      bookingGroup.forEach((booking) => {
        if (!overlapping[booking.asignedTo.uuid]) {
          overlapping[booking.asignedTo.uuid] = [];
        }
        overlapping[booking.asignedTo.uuid].push(bookingGroup);
      });
    });

    const employeeOverlappingArray: EmployeeOverlapping[] = [];

    Object.keys(overlapping).forEach((key) => {
      employeeOverlappingArray.push({
        asignedToUuid: key,
        bookings: overlapping[key].filter((subArr, index) => {
          return (
            index ===
            overlapping[key].findIndex(
              (arr) => JSON.stringify(arr) === JSON.stringify(subArr)
            )
          );
        }),
      });
    });

    return employeeOverlappingArray;
  }
  countOverlappingReservations(reservations: Booking[]): number {
    const timePoints: { time: number; isStart: boolean }[] = [];

    reservations.forEach((reservation) => {
      const start = reservation.startsHour * 60 + reservation.startsMinute;
      const end = start + reservation.duration;
      timePoints.push({ time: start, isStart: true });
      timePoints.push({ time: end, isStart: false });
    });

    timePoints.sort((a, b) => a.time - b.time || (a.isStart ? -1 : 1));

    let maxConcurrent = 0;
    let currentConcurrent = 0;

    timePoints.forEach((timePoint) => {
      if (timePoint.isStart) {
        currentConcurrent++;
      } else {
        currentConcurrent--;
      }

      if (currentConcurrent > maxConcurrent) {
        maxConcurrent = currentConcurrent;
      }
    });

    return maxConcurrent;
  }

  groupOverlappingBookings(bookings: Booking[]): Booking[][] {
    const groupedReservations: Booking[][] = [];

    bookings.forEach((reservation) => {
      let foundGroup = false;

      for (const group of groupedReservations) {
        if (group.some((r) => this.isOverlapping(reservation, r))) {
          group.push(reservation);

          foundGroup = true;
          break;
        }
      }

      if (!foundGroup) {
        groupedReservations.push([reservation]);
      }
    });

    return groupedReservations;
  }

  resizeCards2(array: Booking[][]) {
    console.log(array);

    if (array.length > 0) {
      // cogemos las book q tienen overlappin con mas de 1 reserva

      array.map((bookGroup: Booking[]) => {
        bookGroup.map((book: Booking) => {
          if (book.isMultiple) {
            const booksAtSameTime =
              this.countOverlappingReservations(bookGroup);
            book.multipleMinWidth = booksAtSameTime;
          }
        });

        bookGroup.map((book: Booking, index: number) => {
          if (this.checkIfAllMultiple(bookGroup)) {
            this.resizeCardsInline(book, index, bookGroup);
          } else {
            this.resizeCards(book, index, bookGroup);
          }
        });
        console.log(bookGroup);
      });
    } else {
      console.log('entra aqui de error');

      this.isOverlapEnabled = false;
    }
    array = [];
  }

  checkIfMultipleExistsOnGroup(
    multipleCollection: Booking[],
    groupOvelapped: Booking[]
  ): boolean {
    return multipleCollection.some((multiple: Booking) =>
      groupOvelapped.includes(multiple)
    );
  }
  getMultipleMinWidthValue(multipleCollection: Booking[]): number {
    return multipleCollection.find((multiple: Booking) => multiple.isMultiple)
      ?.multipleMinWidth;
  }


  resizeCardsInline(item: Booking, index: number, array: Booking[]) {
    const elem = document.getElementById(item.uuid);
    if (elem) {
      if (array.length === 1) {
        item.mobileSize.width = this.columnWidth;
        elem.style.width = this.columnWidth + 'px';
        elem.style.left = 0 + 'px';
      } else {
        item.mobileSize.width = this.columnWidth / array.length;
        elem.style.width = this.columnWidth / array.length + 'px';
        elem.style.left = (this.columnWidth / array.length) * index + 'px';
      }
    }
  }
  resizeCards(item, index, array) {
    const elem = document.getElementById(item.uuid);
    if (!elem) {
      return;
    }

    const multipleMinWidth = this.getMultipleMinWidthValue(array);

    if (item.isMultiple) {
      this.updateSizeForMultipleBooking(
        item,
        elem,
        multipleMinWidth,
        index,
        array
      );
    } else {
      this.updateSizeForOverlappingBookings(
        item,
        elem,
        index,
        array,
        multipleMinWidth
      );
    }
  }

  updateSizeForMultipleBooking(
    item: Booking,
    elem,
    multipleMinWidth,
    index,
    array
  ) {
    let width;

    if (this.checkIfAllOverlapingsAreOneToOne(array)) {
      width = this.columnWidth / 2;
    } else {
      if (item.overlapCount > item.multipleMinWidth) {
        width = this.columnWidth / item.multipleMinWidth;
      } else if (
        item.overlapCount === item.multipleMinWidth &&
        !this.checkIfIsOverlappedMoreThanOne(item, array)
      ) {
        width = this.columnWidth / (item.multipleMinWidth - 1);
      } else if (
        item.overlapCount === item.multipleMinWidth &&
        this.checkIfIsOverlappedMoreThanOne(item, array)
      ) {
        width = this.columnWidth / item.multipleMinWidth;
      } else {
        width =
          this.columnWidth /
          (item.overlapCount - (this.countManyBooksOneToOne(array) - 1));
      }
    }

    item.mobileSize.width = width;
    elem.style.width = width + 'px';
    elem.style.left = Math.min(width * index, this.columnWidth - width) + 'px';
  }

  checkIfIsOverlappedMoreThanOne(
    item: Booking,
    bookingCollection: Booking[]
  ): boolean {
    const items = bookingCollection.filter(
      (book: Booking) => book.overlapCount === item.overlapCount - 1
    );
    if (items.length > 1) {
      return true;
    }
    return false;
  }
  checkIfAllOverlapingsAreOneToOne(booking: Booking[]): boolean {
    const x = booking.filter((x) => x.overlapCount === 1);
    if (x.length === booking.length - 1) {
      return true;
    }
    return false;
  }
  countManyBooksOneToOne(booking: Booking[]): number {
    return booking.filter((x) => x.overlapCount === 1).length;
  }

  updateSizeForOverlappingBookings(
    item,
    elem,
    index,
    array: Booking[],
    multipleMinWidth
  ) {
    let widthPerOverlap;
    if (this.checkIfAllOverlapingsAreOneToOne(array)) {
      console.log('entra');

      widthPerOverlap = this.columnWidth / 2;
    } else {
      if (item.overlapCount === 1) {
        widthPerOverlap =
          this.columnWidth -
          (this.columnWidth / multipleMinWidth - item.overlapCount);
      } else {
        console.log(item, this.countOverlappingReservations(array));

        if (
          this.countOverlappingReservations(array) - 1 ===
          item.overlapCount
        ) {
          widthPerOverlap = this.columnWidth / (item.overlapCount + 1);
        } else if (
          this.countOverlappingReservations(array) - 1 >
          item.overlapCount
        ) {
          widthPerOverlap = this.columnWidth / item.overlapCount;
        } else {
          widthPerOverlap = this.columnWidth / (multipleMinWidth - 1);
        }
      }
    }

    item.mobileSize.width = widthPerOverlap;
    elem.style.width = widthPerOverlap + 'px';

    let newLeftPosition;
    if (!this.isOverlapping(item, array[index - 1])) {
      newLeftPosition = widthPerOverlap * (index - 1);
    } else {
      newLeftPosition = widthPerOverlap * index;
    }

    newLeftPosition = Math.min(
      newLeftPosition,
      this.columnWidth - widthPerOverlap
    );
    elem.style.left = newLeftPosition + 'px';
  }

  checkIfBookingHasMoreDurationThanMultiple(
    item: Booking,
    bookingCollection: Booking[]
  ): number {
    return bookingCollection.findIndex(
      (book: Booking) => book.duration > item.duration && !book.isMultiple
    );
  }
 

  checkIfOverlapCard(uuid1: string, collection: Booking[]): boolean {
    const div1: HTMLElement | null = document.getElementById(uuid1);

    return collection.some((book: Booking) => {
      if (book.uuid !== uuid1) {
        const div2: HTMLElement | null = document.getElementById(book.uuid);
        const rect1: DOMRect = div1.getBoundingClientRect();
        const rect2: DOMRect = div2.getBoundingClientRect();

        const isDiv1InsideDiv2: boolean =
          rect1.left >= rect2.left &&
          rect1.right <= rect2.right &&
          rect1.top >= rect2.top &&
          rect1.bottom <= rect2.bottom;

        const isDiv2InsideDiv1: boolean =
          rect2.left >= rect1.left &&
          rect2.right <= rect1.right &&
          rect2.top >= rect1.top &&
          rect2.bottom <= rect1.bottom;

        return isDiv1InsideDiv2 || isDiv2InsideDiv1;
      }
    });
  }

  checkIfAllMultiple(booking: Booking[]): boolean {
    return booking.every((book: Booking) => book.isMultiple);
  }
  setNewPositionFGhost(newPos: CardsPosition) {
    this.$reservations.value.map((item: Booking) => {
      if (item.uuid === newPos.uuid) {
        item.mobilePosition = Object.assign(
          item.mobilePosition,
          newPos.position
        );
      }
    });
  }

  preventDefault(e) {
    e.preventDefault();
  }

  createBlankCard(position: Position, time: Time, event: any) {
    this.isGhosting = true;
    const newBooking: Booking = new Booking();
    newBooking.uuid = 'ghost_';

    newBooking.isBooking = true;
    newBooking.duration = 60;
    newBooking.startsHour = time.hours;
    newBooking.startsMinute = time.minutes;
    newBooking.mobilePosition = {
      x: position.x,
      y: position.y - 48,
      id: newBooking.uuid,
    };
    newBooking.mobileSize = {
      width: this.columnWidth,
      height: this.setHeightByDuration(60),
    };
    newBooking.service = [];
    newBooking.startsDay = '2030-01-01';
    newBooking.isGhost = true;

    this.$reservations.value.push(newBooking);

    this.fillCardsPosition(this.$reservations.value);
    this.draggableItem = newBooking.uuid;
    this.draggingBooking = { ...newBooking };

    this.cdr.detectChanges();

    this.createDraggable(true);
    const instanceGhostIndex = this.getDraggableInstanceIndexByUuid(
      newBooking.uuid
    );
    const ghost = this.draggableInstance[instanceGhostIndex];
    ghost.startDrag(event);
    this.cdr.detectChanges();
  }

  logLongPress(event: any, uuid?: any) {
    if (!uuid && !this.isScrolling) {
      const elementParent = document.getElementById('draggableZone');
      const domRectParent = elementParent?.getBoundingClientRect();
      const relativePos = event.startY - domRectParent.top;
      const relativeColumn =
        (event.startX - domRectParent.left) / this.columnWidth;
      const employeeIndex = relativeColumn.toString().split('.')[0];
      const time = this.calculateHourByPixel(relativePos / 24, this.timetable);
      const newPos: Position = {
        x: parseInt(employeeIndex, 10) * this.columnWidth,
        y: relativePos,
      };
      const timeGhost = this.calculateHourByPixel(
        (relativePos - 48) / 24,
        this.timetable
      );
      console.log(employeeIndex);

      if (!this.isGhosting && this.draggableItem === null) {
        const data: Longpress = {
          selectedDay: this.selectedDate,
          selectedHour: timeGhost,
          employee: this.timetable.employees[employeeIndex],
        };
        this.ghostingData = data;
        this.createBlankCard(newPos, timeGhost, event.event);
        this.isGhosting = true;
        this.draggableItem = null;
      }
    } else if (uuid && !this.isScrolling && !uuid.includes('ghos')) {
      this.draggableItem = uuid;
      this.draggingBooking = this.$reservations.value.find(
        (book: Booking) => book.uuid === uuid
      );
      this.createDraggable(false, false);
      const i =
        this.draggableInstance[this.getDraggableInstanceIndexByUuid(uuid)];
      i.startDrag(event.event);
      this.isEditting = true;
      const el1 = document.getElementById(uuid);
      if (el1 !== null) {
        this.draggableItem = uuid;
        this.editBooking.emit(true);
        el1.classList.add('selectedCardMoveable');
      }
    }
  }

  getPosition(e: any) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return {
      x,
      y,
    };
  }

  fillCardsPosition(reservationCollection: Booking[]) {
    this.$reservations.next(null);
    this.$reservations.next(reservationCollection);
  }

  fillFreetimePosition(reservationCollection: Booking[]) {
    this.$freeTime.next(null);
    this.$freeTime.next(reservationCollection);
  }

  setFirstSize(reservationCollection: Booking[]) {
    reservationCollection.forEach((item: Booking, index: number) => {
      item.mobileSize = {
        width: this.columnWidth,
        height: this.setHeightByDuration(item.duration),
      };

      setTimeout(() => {
        this.newCheckOverlap(item.uuid);
      }, 100);
    });
    this.isReady = true;
  }

  setFirstFreeTimeSize(reservationCollection: Booking[]) {
    reservationCollection.forEach((item: Booking, index: number) => {
      item.mobileSize = {
        width: this.columnWidth,
        height: this.setHeightByDuration(item.duration),
      };
    });
    this.isReady = true;
  }

  removeOverlap(item: Booking) {
    this.isOverlapCollection.map((overlapItem: IsOverlap) => {
      if (overlapItem.booking) {
        overlapItem.booking = overlapItem.booking.filter(
          (book: Booking) => book.uuid !== item.uuid
        );
      }
    });
  }

  onResize(event, uuid: string) {
    this.isDragging = false;
    this.draggableInstance.map((item: Draggable) => item.kill());
    const book = this.$reservations.value.filter(
      (bookItem: Booking) => bookItem.uuid === uuid
    )[0];
    const height = Math.round(event.size.height * 5) / 5;
    book.duration = Math.round((height / 24) * 15 * 5) / 5;
    book.mobileSize.height = height;
    this.hourByPosition(uuid);
  }
  setUpOneline(reservation: Booking): number {
    const totalCharacters = 19;

    if (reservation?.customer.isWalkingClient) {
      return totalCharacters - 'Sin cita '.length;
    } else {
      return (
        totalCharacters -
        (reservation?.customer?.name.length +
          reservation?.customer?.lastname.length)
      );
    }
  }
  onResizeStop(uuid: string) {
    this.createDraggable(false, true);
    this.hourByPosition(uuid);
    this.isDragging = false;
    const [booking] = this.$reservations.value.filter(
      (item) => item.uuid === uuid
    );
    if (!booking.isGhost) {
      this.editBooking.emit(true);
    } else {
      this.longPressAction.emit(this.ghostingData);
    }
  }

  setHeightByDuration(duration: number): number {
    return duration * 2 >= 24 ? (duration * 24) / 15 : 24;
  }

  isNotPayed(booking: Booking): boolean {
    const splittedDate: string[] = booking.startsDay.split('-');
    const year = parseInt(splittedDate[0], 10);
    const month = parseInt(splittedDate[1], 10) - 1;
    const day = parseInt(splittedDate[2], 10);
    const date = new Date(
      year,
      month,
      day,
      booking.startsHour,
      booking.startsMinute
    );
    const reservationEndDate = addMinutes(date, booking.duration);

    return (
      isPast(reservationEndDate) &&
      booking.payment === null &&
      !booking.paymentSettedUuid &&
      booking.status !== 'No asistida'
    );
  }

  editBookingConfirmation() {
    if (this.isOverlapEnabled) {
      this.subscription.add(
        this.editBookingService.editBookingConfirm
          .asObservable()
          .subscribe((res) => {
            this.isEditting = false;
            if (this.draggableInstance) {
              this.draggableInstance.map((item: Draggable) => item.kill());
            }
            const el1 = document.getElementById(this.draggableItem);
            if (el1 !== null) {
              el1.classList.remove('selectedCardMoveable');
            }

            this.editBooking.emit(false);
            if (res) {
              const findBooking = this.$reservations.value.find(
                (item) => item.uuid === this.draggableItem
              );

              this.updateBooking.emit(findBooking);

              //this.setFirstSize(this.timetable.bookings);

              this.draggableItem = null;
            } else {
              this.dragPosition = [];
              this.fillCardsPosition(this.timetable?.bookings);
              this.setFirstSize(this.timetable.bookings);
              this.draggableItem = null;
            }
          })
      );
    } else {
      console.log('que pollas es esto');
    }
  }

  isInsideTimetable(): boolean {
    const date = new Date();
    const lastFrame =
      this.timetable.timeFrames[this.timetable.timeFrames.length - 1];
    const firstFrame = this.timetable.timeFrames[0];

    const timetableOpen: Date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(firstFrame.label.split(':')[0], 10),
      parseInt(firstFrame.label.split(':')[1], 10)
    );
    let timetableClose: Date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(lastFrame.label.split(':')[0], 10),
      parseInt(lastFrame.label.split(':')[1], 10)
    );
    if (isBefore(timetableClose, timetableOpen)) {
      timetableClose = addDays(timetableClose, 1);
    }

    return areIntervalsOverlapping(
      {
        start: date,
        end: date,
      },
      {
        start: timetableOpen,
        end: timetableClose,
      },

      {
        inclusive: true,
      }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
