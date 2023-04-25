import { intersectionBy } from 'lodash';

/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/quotes */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import {
  AlertController,
  IonRouterOutlet,
  IonSlides,
  isPlatform,
  ModalController,
} from '@ionic/angular';
import { NavController } from '@ionic/angular';
import {
  eachDayOfInterval,
  eachMinuteOfInterval,
  endOfISOWeek,
  format,
  formatISO9075,
  nextDay,
  startOfISOWeek,
  addMonths,
  addWeeks,
  getDate,
  getMonth,
  previousDay,
  subMonths,
  subWeeks,
  getYear,
  isToday,
  differenceInMinutes,
  getWeek,
  addMinutes,
  getHours,
  getMinutes,
  isBefore,
  isAfter,
  getDay,
  subMinutes,
  subHours,
  addHours,
  isEqual,
  isWithinInterval,
} from 'date-fns';
import es from 'date-fns/locale/es';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { TimeTableBuilder } from 'src/app/core/builder/timetable.builder';
import { EDays } from 'src/app/core/enums/days.enum';
import { DateTime } from 'src/app/core/interfaces/date.interface';
import { Longpress } from 'src/app/core/interfaces/longpress.interface';
import {
  IRangeTimeTable,
  ScheduleHour,
} from 'src/app/core/interfaces/rangeTimetable.interface';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { DayModel } from 'src/app/core/models/day.model';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { NonAvailability } from 'src/app/core/models/non-availability.model';
import { Booking } from 'src/app/core/models/reservation.model';
import { TimeTable } from 'src/app/core/models/time-table.model';
import { BookingService } from 'src/app/core/services/booking/booking.service';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
import { NonAvailabilityService } from 'src/app/core/services/non-availability/non-availability.service';
import { TimeTableService } from 'src/app/core/services/timeTable/time-table.service';
import { EditBooking } from 'src/app/core/utils/editBooking.service';
import { ActionSheetComponent } from 'src/app/shared/components/action-sheet/action-sheet.component';
import { EmployeeListComponent } from 'src/app/shared/components/employee-list/employee-list.component';
import { WeeklyBookings } from 'src/app/core/dto/weekly-bookings.dto';
import { WeeklyNonAvailability } from 'src/app/core/dto/weekly-non-availability.dto';
import { NonAvailabilityDto } from 'src/app/core/dto/non-availability.dto';
import { NotificationsService } from 'src/app/core/services/notifications/notifications.service';
import { Notifications } from 'src/app/core/models/notifications/notifications.model';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { SmsDto } from 'src/app/core/dto/sms.dto';
import { TimeTable as timetableSecond } from '../../core/models/timeTable/timeTable.model';
import { FrameLabel } from 'src/app/core/interfaces/frame.label.interface';

@Component({
  selector: 'app-booking-manager',
  templateUrl: './booking-manager.page.html',
  styleUrls: ['./booking-manager.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingManagerPage implements OnInit, OnDestroy {
  @ViewChild('slideDate') dateslide: IonSlides;
  @ViewChild(ActionSheetComponent) actionSheet: ActionSheetComponent;
  availableHours: string[] = [];

  public timetable: TimeTable[] = [];

  public employeeCollection: Employee[] = [];

  public nonAvailabilityCollection: NonAvailability[];

  public notificationsCollection: Notifications[] = [];

  public dayClass: string;

  commerceLogged: string;

  filteredEmployees: Employee[] = [];

  today: Date = new Date();

  todayDay: DayModel;

  weekNumber = 0;

  selectedDay: DayModel;

  timeFrames: string[];

  days: DayModel[];

  isToday = true;

  isReady: boolean;

  bookingCollection: Booking[];

  editBooking = false;

  commerce: Commerce;

  isIOS = false;

  isModalOpenned = false;

  indexSelected = 0;

  overscroll = false;

  isAnimating = false;

  overmsg: string;

  isTablet: boolean;

  notificationsNotReaded: number;

  public actualDate: string = format(new Date(), 'iii., d  MMM', {
    locale: es,
  });
  overScroll: boolean;
  currentUser: Employee;

  subscription: Subscription = new Subscription();

  constructor(
    private bookingService: BookingService,
    private employeeService: EmployeeService,
    private timetableService: TimeTableService,
    private nonAvailabilityService: NonAvailabilityService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private editBookingService: EditBooking,
    private activatedRoute: ActivatedRoute,
    private notificationsService: NotificationsService,
    private cd: ChangeDetectorRef,
    private screenOrientation: ScreenOrientation
  ) {
    this.isIOS = isPlatform('android') ? false : true;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (window.outerWidth > 426) {
      this.isTablet = true;
      this.dayClass = 'px-8';
    } else {
      this.isTablet = false;
      this.dayClass = 'px-0';
    }
    this.commerceLogged = JSON.parse(
      localStorage.getItem('currentUser')
    ).commerce;
  }

  ionViewWillEnter() {
    this.screenOrientation.unlock();
    localStorage.removeItem('columnWidth');
    this.checkScreenOrientation();
    this.isReady = false;
    this.editBooking = false;

    this.filteredEmployees =
      localStorage.getItem('filteredEmployee') !== ''
        ? JSON.parse(localStorage.getItem('filteredEmployee'))
        : [];

    this.concatRequiredRequest(
      this.commerceLogged,
      getWeek(this.selectedDay.date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      })
    );
  }
  ionViewDidEnter() {
    this.isReady = true;
  }

  checkScreenOrientation() {
    this.subscription.add(this.screenOrientation.onChange().subscribe((res) => {
      this.timetable = null;
      this.concatRequiredRequest(
        this.commerceLogged,
        getWeek(this.selectedDay.date, {
          weekStartsOn: 1,
          firstWeekContainsDate: 4,
        })
      );
      if (window.outerWidth > 426) {
        this.isTablet = true;
        this.dayClass = 'px-8';
        this.cd.detectChanges();
      } else {
        this.isTablet = false;
        this.dayClass = 'px-0';
        this.cd.detectChanges();
      }
    }));
  }

  ngOnInit() {
    setTimeout(() => {
      this.dateslide.lockSwipes(true);
    }, 150);
    this.weekNumber = getWeek(this.today, {
      weekStartsOn: 1,
      firstWeekContainsDate: 4,
    });

    [this.selectedDay] = this.formatDateToDays([this.today]);
    this.indexSelected = this.selectedDay.date.getDay();
    this.showDayTimetable();
    [this.todayDay] = this.formatDateToDays([this.today]);
    this.getThisWeekDays();
  }

  doRefresh(event): void {
    this.concatRequiredRequest(
      this.commerceLogged,
      getWeek(this.selectedDay.date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      }),
      event
    );
  }

  openActionSheet(data: Longpress = null) {
    const selectedDay = format(this.selectedDay.date, 'yyyy-MM-dd', {
      locale: es,
    });

    this.actionSheet.presentActionSheet(data, selectedDay);
  }

  returnDaysOfWeek(startDay: Date, endDate: Date): Date[] {
    return eachDayOfInterval({
      start: startDay,
      end: endDate,
    });
  }

  public checkIsToday(date: Date) {
    return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  }

  public goToToday() {
    [this.todayDay] = this.formatDateToDays([new Date()]);
    this.getThisWeekDays();
    this.getTodayWeek();

    if (
      getWeek(this.selectedDay.date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      }) !==
      getWeek(this.todayDay.date, { weekStartsOn: 1, firstWeekContainsDate: 4 })
    ) {
      this.selectDate(this.todayDay);
      this.concatRequiredRequest(
        this.commerceLogged,
        getWeek(this.selectedDay.date, {
          weekStartsOn: 1,
          firstWeekContainsDate: 4,
        })
      );
    } else {
      this.selectDate(this.todayDay);
    }
  }

  showDayTimetable(): string {
    if (this.commerce?.timetable) {
      const timetable = JSON.parse(
        this.commerce?.timetable[EDays[this.indexSelected]]
      );
      if (timetable.start.hour === null) {
        return 'Cerrado';
      }
      const start = new Date(
        2022,
        1,
        1,
        timetable.start.hour,
        timetable.start.minute
      );
      const end = new Date(
        2022,
        1,
        1,
        timetable.end.hour,
        timetable.end.minute
      );
      const startHour = format(start, 'HH:mm');
      const endHour = format(end, 'HH:mm');
      return startHour + '-' + endHour;
    }
  }

  formatHoursOfInterval(interval: Date[]): string[] {
    const newHours = interval.map((item: Date) =>
      formatISO9075(item, {
        format: 'extended',
        representation: 'time',
      }).substring(
        0,
        formatISO9075(item, { format: 'extended', representation: 'time' })
          .length - 3
      )
    );

    return newHours;
  }
  formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }
  buildFrames(
    startDateFrame: DateTime,
    endDateFrame: DateTime,
    step: number
  ): string[] {
    const availableHoursInterval = eachMinuteOfInterval(
      {
        start: new Date(
          startDateFrame.year,
          startDateFrame.month,
          startDateFrame.day,
          startDateFrame.hour,
          startDateFrame.minute
        ),
        end: new Date(
          endDateFrame.year,
          endDateFrame.month,
          endDateFrame.day,
          endDateFrame.hour,
          endDateFrame.minute
        ),
      },
      { step }
    );
    return this.formatHoursOfInterval(availableHoursInterval);
  }

  concatRequiredRequest(commerce: string, week: number, event?: any) {
    forkJoin([
      this.findAllBookingByWeek(commerce, week),
      this.findCommerceTimeTable(commerce),
      this.findEmployees(commerce),
      this.findAllNonAvailabilityByWeek(commerce, week),
    ]).subscribe(
      (res: [WeeklyBookings, Commerce, Employee[], WeeklyNonAvailability]) => {
        this.timetable = [];

        const [booking, commerceRes, employee, nonAva] = res;


        this.commerce = commerceRes;
        employee.map(
          (emp) =>
          (emp.services = intersectionBy(
            this.commerce.services,
            emp.services,
            'uuid'
          ))
        );

        this.employeeCollection = employee.filter(
          (item) => item.services && item.services.length > 0 && item.isActive);
        if (this.employeeCollection.length < 1) {
          this.timetable = [];
          this.cd.detectChanges();
        } else {
          if (this.currentUser.role === 'empleado_basico') {
            this.employeeCollection = employee.filter(emp => emp.uuid === this.currentUser.uuid);
          }

          this.findNotificationsByEmployee(this.currentUser);

          Object.keys(booking).forEach((key: string, index: number) => {
            this.bookingCollection = booking[index];
            this.nonAvailabilityCollection = nonAva[key];
            this.bookingCollection = [
              ...this.filterBookingByEmployee(booking[key]),
            ];
            this.nonAvailabilityCollection = this.filterNonAvailabilityByEmployee(
              nonAva[key]
            );

            const weekDay = EDays[index];

            // Get day timetable

            const timetableDay: IRangeTimeTable = JSON.parse(
              commerceRes.timetable[weekDay]
            );

            if (this.bookingCollection.length > 0) {
              const startDateFrame: DateTime = {
                year: getYear(new Date(this.bookingCollection[0].startsDay)),
                month: getMonth(new Date(this.bookingCollection[0].startsDay)),
                day: getDate(new Date(this.bookingCollection[0].startsDay)),
                hour:
                  timetableDay.start.hour !== null
                    ? timetableDay.start.hour - 1
                    : 0,
                minute:
                  timetableDay.start.minute !== null
                    ? timetableDay.start.minute
                    : 0,
              };
              const endDateFrame: DateTime = {
                year: getYear(new Date(this.bookingCollection[0].startsDay)),
                month: getMonth(new Date(this.bookingCollection[0].startsDay)),
                day: getDate(new Date(this.bookingCollection[0].startsDay)),
                hour: timetableDay.end.hour !== null ? timetableDay.end.hour : 24,
                minute:
                  timetableDay.end.minute !== null
                    ? timetableDay.end.minute + 45
                    : 0,
              };
              const overtimetable = this.checkIfBookingIsOutOfCommerceTimetable(
                this.bookingCollection,
                startDateFrame,
                endDateFrame
              );
              const startOverTimeDate = this.setOverStartTimes(
                startDateFrame,
                overtimetable.start
              );
              const endOverTimeDate = this.setOverEndTimes(
                endDateFrame,
                overtimetable.end
              );
              this.timeFrames = this.buildFrames(
                overtimetable.start,
                overtimetable.end,
                15
              );

              this.timetable.push(
                this.buildTimetable(
                  this.mapTimeFramesToLabel(this.timeFrames,timetableDay),
                  this.bookingCollection,
                  this.employeeCollection.sort((a: Employee, b: Employee) =>
                    a.order < b.order ? -1 : 1
                  ),
                  this.nonAvailabilityCollection,
                  this.filterFreeTimeByEmployee(
                    this.employeeCollection.sort((a: Employee, b: Employee) =>
                      a.order < b.order ? -1 : 1
                    ),
                    this.nonAvailabilityCollection,
                    index
                  ),
                  startOverTimeDate,
                  endOverTimeDate,
                  index,
                  timetableDay
                )
              );
            } else {
              const startDateFrame: DateTime = {
                year: getYear(this.today),
                month: getMonth(this.today),
                day: getDate(this.today),
                hour:
                  timetableDay.start.hour !== null
                    ? timetableDay.start.hour - 1
                    : 0,
                minute:
                  timetableDay.start.minute !== null
                    ? timetableDay.start.minute
                    : 0,
              };
              const endDateFrame: DateTime = {
                year: getYear(this.today),
                month: getMonth(this.today),
                day: getDate(this.today),
                hour: timetableDay.end.hour !== null ? timetableDay.end.hour : 24,
                minute:
                  timetableDay.end.minute !== null
                    ? timetableDay.end.minute + 45
                    : 0,
              };
              const overtimetable = this.checkIfBookingIsOutOfCommerceTimetable(
                this.bookingCollection,
                startDateFrame,
                endDateFrame
              );
              const startOverTimeDate = this.setOverStartTimes(
                startDateFrame,
                overtimetable.start
              );
              const endOverTimeDate = this.setOverEndTimes(
                endDateFrame,
                overtimetable.end
              );
              this.timeFrames = this.buildFrames(
                overtimetable.start,
                overtimetable.end,
                15
              );

              this.timetable.push(
                this.buildTimetable(
                  this.mapTimeFramesToLabel(this.timeFrames,timetableDay),
                  this.bookingCollection,
                  this.employeeCollection.sort((a: Employee, b: Employee) =>
                    a.order < b.order ? -1 : 1
                  ),
                  this.nonAvailabilityCollection,
                  this.filterFreeTimeByEmployee(
                    this.employeeCollection.sort((a: Employee, b: Employee) =>
                      a.order < b.order ? -1 : 1
                    ),
                    this.nonAvailabilityCollection,
                    index
                  ),
                  startOverTimeDate,
                  endOverTimeDate,
                  index,
                  timetableDay
                )
              );
            }


            this.isAnimating = false;
            this.overscroll = false;
            event?.target.complete();
          });
          this.overscroll = false;
        }



        this.cd.detectChanges();
      }
    );
  }

  setOverStartTimes(startCommerce: DateTime, startOvertime: DateTime): number {
    const startCommerceDate = this.setDateFromDatetime(startCommerce);
    const startOverTimeDate = this.setDateFromDatetime(startOvertime);

    let diffHour =
      differenceInMinutes(startCommerceDate, startOverTimeDate) / 15;
    if (diffHour < 0) {
      diffHour = diffHour * -1;
    }
    return diffHour + 4;
  }
  setOverEndTimes(endCommerce: DateTime, endOvertime: DateTime): number {
    const startCommerceDate = this.setDateFromDatetime(endCommerce);
    const startOverTimeDate = this.setDateFromDatetime(endOvertime);
    let diffHour =
      differenceInMinutes(startOverTimeDate, startCommerceDate) / 15;
    if (diffHour < 0) {
      diffHour = diffHour * -1;
    }
    return diffHour + 4;
  }
  checkIfBookingIsOutOfCommerceTimetable(
    bookingCollection: Booking[],
    startDate: DateTime,
    endDate: DateTime
  ): { start: DateTime; end: DateTime } {
    let start = startDate;
    let end = endDate;
    bookingCollection.forEach((book: Booking) => {
      const newDateTime: DateTime = {
        year: getYear(new Date(book.startsDay)),
        month: getMonth(new Date(book.startsDay)),
        day: getDate(new Date(book.startsDay)),
        hour: book.startsHour,
        minute: book.startsMinute,
      };

      const startDateBook = this.setDateFromDatetime(newDateTime);
      const endDateBook = addMinutes(this.setDateFromDatetime(newDateTime), book.duration);
      const startDateCommerce = this.setDateFromDatetime(startDate);
      const endDateCommerce = this.setDateFromDatetime(endDate);
      const hoursToHaveMargin = 1;
      if (isBefore(startDateBook, startDateCommerce) || isEqual(startDateBook, startDateCommerce)) {
        if (start) {
          const startSetted = this.setDateFromDatetime(start);
          if (isBefore(startDateBook, startSetted) || isEqual(startDateBook, startSetted)) {
            const newDateTimeSetted: DateTime = {
              year: getYear(new Date(book.startsDay)),
              month: getMonth(new Date(book.startsDay)),
              day: getDate(new Date(book.startsDay)),
              hour: book.startsHour - hoursToHaveMargin,
              minute: book.startsMinute,
            };
            start = newDateTimeSetted;
          }
        }
      } else if (isAfter(startDateBook, endDateCommerce) || isAfter(endDateBook, endDateCommerce)) {
        if (end) {
          const dateWithDuration = addMinutes(startDateBook, book.duration + 60);
          const newEndDateTime: DateTime = {
            year: getYear(new Date(dateWithDuration)),
            month: getMonth(new Date(dateWithDuration)),
            day: getDate(new Date(dateWithDuration)),
            hour: getHours(dateWithDuration),
            minute: getMinutes(dateWithDuration),
          };
          end = newEndDateTime;
        }
      }
    });
    return { start, end };
  }
  setDateFromDatetime(datetime: DateTime): Date {
    return new Date(
      datetime.year,
      datetime.month,
      datetime.day,
      datetime.hour,
      datetime.minute
    );
  }


  findNotificationsByEmployee(employee: Employee) {
    this.subscription.add(this.notificationsService
      .getByEmployee(employee.uuid)
      .subscribe((result: Notifications[]) => {
        result = [...result.filter((item: Notifications) => item.createdBy !== employee.uuid)];
        this.notificationsCollection = [];
        this.notificationsCollection = result.sort(
          (a: Notifications, b: Notifications) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.notificationsNotReaded = this.notificationsCollection.filter(
          (notification: Notifications) => notification.isRead === false
        ).length;
        this.cd.detectChanges();
      }));
  }

  findAllBookingByWeek(
    commerce: string,
    week: number
  ): Observable<WeeklyBookings> {
    return this.bookingService.findAllBookingByWeek(commerce, week);
  }
  findAllBookingByDay(commerce: string, date: string): Observable<Booking[]> {
    return this.bookingService.findAllBookingByDay(commerce, date);
  }
  findAllNonAvailabilityByDay(
    commerce: string,
    date: string
  ): Observable<NonAvailability[]> {
    return this.nonAvailabilityService.findAllNonAvailabilityByDay(
      commerce,
      date
    );
  }
  findAllNonAvailabilityByWeek(
    commerce: string,
    week: number
  ): Observable<WeeklyNonAvailability> {
    return this.nonAvailabilityService.findAllNonAvailabilityByWeek(
      commerce,
      week
    );
  }

  findCommerceTimeTable(commerce: string): Observable<Commerce> {
    return this.timetableService.findTimetableByCommerceAgendaPage(commerce);
  }
  findEmployees(commerce: string): Observable<Employee[]> {
    return this.employeeService.findEmployeesAgenda(commerce);
  }

  selectDate(date: DayModel) {
    this.isToday = isToday(date.date);
    this.selectedDay = date;
    this.indexSelected = this.selectedDay.date.getDay();
    this.showDayTimetable();
  }

  async presentEmployeeModal() {
    const modal = await this.modalController.create({
      component: EmployeeListComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        selectedEmployeeCompo: this.filteredEmployees,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data.employee !== undefined) {
      this.filteredEmployees = [...data.employee];
      this.employeeCollection = [...data.employee];
      this.selectDate(this.selectedDay);
    }
  }
  filterBookingByEmployee(booking: Booking[]): Booking[] {
    if (booking.length === 0) {
      return booking;
    }
    const newBook: Booking[] = [];

    this.employeeCollection.forEach((emp: Employee) => {
      booking.forEach((book: Booking) => {
        if (book.asignedTo.uuid === emp.uuid) {
          newBook.push(book);
        }
      });
    });
    return newBook;
  }
  filterNonAvailabilityByEmployee(
    booking: NonAvailability[]
  ): NonAvailability[] {
    const newBook: NonAvailability[] = [];

    this.employeeCollection.forEach((emp: Employee) => {
      booking.forEach((book: NonAvailability) => {
        if (book.employee.uuid === emp.uuid) {
          newBook.push(book);
        }
      });
    });

    return newBook;
  }
  filterFreeTimeByEmployee(
    employeeCollection: Employee[],
    nonAvailabilityCollection: NonAvailability[],
    index: number
  ): NonAvailability[] {
    const newBook: NonAvailability[] = [];

    employeeCollection.forEach((emp: Employee) => {
      const nonAva = this.addNonAvailabilityEmployeeRest(
        emp,
        nonAvailabilityCollection,
        index
      );
      nonAva.map((item: NonAvailability) => newBook.push(item));
    });

    return newBook;
  }
  addNonAvailabilityEmployeeRest(
    employee: Employee,
    nonAvailabilityCollection: NonAvailability[],
    index: number
  ): NonAvailability[] {
    const isOnHolidays = nonAvailabilityCollection.filter(
      (item: NonAvailability) =>
        item.employee.uuid === employee.uuid && item.message === 'Vacaciones'
    );

    if (isOnHolidays.length === 0) {
      const newBook: NonAvailability[] = [];

      const weekDay = EDays[index];

      const timetableDayEmployee: IRangeTimeTable = JSON.parse(
        employee.timetable[weekDay]
      );
      const timetableDayCommerce: IRangeTimeTable = JSON.parse(
        this.commerce.timetable[weekDay]
      );
      const startHourEmployee: Date = new Date(
        2022,
        1,
        1,
        timetableDayEmployee.start.hour,
        timetableDayEmployee.start.minute
      );
      const startHourCommerce: Date = new Date(
        2022,
        1,
        1,
        timetableDayCommerce.start.hour,
        timetableDayCommerce.start.minute
      );
      const endHourEmployee: Date = new Date(
        2022,
        1,
        1,
        timetableDayEmployee.end.hour,
        timetableDayEmployee.end.minute
      );
      const endHourCommerce: Date = new Date(
        2022,
        1,
        1,
        timetableDayCommerce.end.hour,
        timetableDayCommerce.end.minute
      );
      const startDifferenceMinutes = differenceInMinutes(
        startHourEmployee,
        startHourCommerce
      );
      const endDifferenceMinutes = differenceInMinutes(
        endHourCommerce,
        endHourEmployee
      );

      if (
        timetableDayEmployee.start.hour === null &&
        timetableDayCommerce.start.hour !== null
      ) {
        const nonAva: NonAvailability = new NonAvailability();
        nonAva.date = this.formatDate(this.selectedDay.date);
        nonAva.duration = startDifferenceMinutes;
        nonAva.employee = employee;
        nonAva.startHour = timetableDayCommerce.start.hour;
        nonAva.startMinute = timetableDayCommerce.start.minute;
        const rangeTable: IRangeTimeTable = {
          start: {
            hour: timetableDayCommerce.start.hour,
            minute: timetableDayCommerce.start.minute,
          },
          end: {
            hour: timetableDayCommerce.end.hour - 1,
            minute: timetableDayCommerce.end.minute,
          },
        };
        nonAva.timetable = JSON.stringify(rangeTable);
        nonAva.message = 'Libre';
        nonAva.uuid =
          'fake-' +
          Date.now().toString(36) +
          Math.random().toString(36).substr(2);
        newBook.push(nonAva);
      }
      if (
        timetableDayEmployee.start.hour === null &&
        timetableDayCommerce.start.hour === null
      ) {
        const nonAva: NonAvailability = new NonAvailability();
        nonAva.date = this.formatDate(this.selectedDay.date);
        nonAva.duration = startDifferenceMinutes;
        nonAva.employee = employee;
        nonAva.startHour = timetableDayCommerce.start.hour;
        nonAva.startMinute = timetableDayCommerce.start.minute;
        const rangeTable: IRangeTimeTable = {
          start: {
            hour: 0,
            minute: 0,
          },
          end: {
            hour: 23,
            minute: 59,
          },
        };
        nonAva.timetable = JSON.stringify(rangeTable);
        nonAva.message = 'Libre';
        nonAva.uuid =
          'fake-' +
          Date.now().toString(36) +
          Math.random().toString(36).substr(2);
        newBook.push(nonAva);
      }
      if (startDifferenceMinutes > 0) {
        const nonAva: NonAvailability = new NonAvailability();
        nonAva.date = this.formatDate(this.selectedDay.date);
        nonAva.duration = startDifferenceMinutes;
        nonAva.employee = employee;
        nonAva.startHour = timetableDayCommerce.start.hour;
        nonAva.startMinute = timetableDayCommerce.start.minute;
        const rangeTable: IRangeTimeTable = {
          start: {
            hour: timetableDayCommerce.start.hour,
            minute: timetableDayCommerce.start.minute,
          },
          end: {
            hour: timetableDayEmployee.start.hour,
            minute: timetableDayEmployee.start.minute,
          },
        };
        nonAva.timetable = JSON.stringify(rangeTable);
        nonAva.message = 'Libre';

        nonAva.uuid =
          'fake-' +
          Date.now().toString(36) +
          Math.random().toString(36).substr(2);
        newBook.push(nonAva);
      }
      if (endDifferenceMinutes > 0) {
        const nonAva: NonAvailability = new NonAvailability();
        nonAva.date = this.formatDate(this.selectedDay.date);
        nonAva.duration = endDifferenceMinutes;
        nonAva.employee = employee;
        nonAva.startHour = timetableDayCommerce.start.hour;
        nonAva.startMinute = timetableDayCommerce.start.minute;
        const rangeTable: IRangeTimeTable = {
          start: {
            hour: timetableDayEmployee.end.hour,
            minute: timetableDayEmployee.end.minute,
          },
          end: {
            hour: timetableDayCommerce.end.hour,
            minute: timetableDayCommerce.end.minute,
          },
        };
        nonAva.timetable = JSON.stringify(rangeTable);
        nonAva.message = 'Libre';
        nonAva.uuid =
          'fake-' +
          Date.now().toString(36) +
          Math.random().toString(36).substr(2);
        newBook.push(nonAva);
      }
      if (timetableDayEmployee.rest) {
        const nonAva: NonAvailability = new NonAvailability();
        nonAva.date = this.formatDate(this.selectedDay.date);
        nonAva.duration = startDifferenceMinutes;
        nonAva.employee = employee;
        nonAva.startHour = timetableDayCommerce.start.hour;
        nonAva.startMinute = timetableDayCommerce.start.minute;
        const rangeTable: IRangeTimeTable = {
          start: {
            hour: timetableDayEmployee.rest.start.hour,
            minute: timetableDayEmployee.rest.start.minute,
          },
          end: {
            hour: timetableDayEmployee.rest.end.hour,
            minute: timetableDayEmployee.rest.end.minute,
          },
        };
        nonAva.timetable = JSON.stringify(rangeTable);
        nonAva.message = 'Descanso';
        nonAva.uuid =
          'fake-' +
          Date.now().toString(36) +
          Math.random().toString(36).substr(2);
        newBook.push(nonAva);
      }
      return newBook;
    }
    return [];
  }
  nextMonth() {
    [this.selectedDay] = this.formatDateToDays([
      addMonths(this.selectedDay.date, 1),
    ]);

    this.selectDate(this.selectedDay);
    this.getThisWeekDays();
    this.concatRequiredRequest(
      this.commerceLogged,
      getWeek(this.selectedDay.date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      })
    );
  }

  prevMonth() {
    [this.selectedDay] = this.formatDateToDays([
      subMonths(this.selectedDay.date, 1),
    ]);

    this.selectDate(this.selectedDay);
    this.getThisWeekDays();
    this.concatRequiredRequest(
      this.commerceLogged,
      getWeek(this.selectedDay.date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      })
    );
  }

  displayMonthAndYear(): string {
    const month: string = format(this.selectedDay.date, 'LLLL', {
      locale: es,
    }).toUpperCase();

    return month;
  }
  dateChanged(value: string, modalId: string) {
    const date = new Date(value);

    this.selectDate(this.formatDateToDays([date])[0]);
    const startDay = startOfISOWeek(this.selectedDay.date);
    const nextDayWeek = startOfISOWeek(nextDay(startDay, 0));
    const lastDayWeek = endOfISOWeek(nextDayWeek);
    this.days = this.formatDateToDays(
      this.returnDaysOfWeek(nextDayWeek, lastDayWeek)
    );
    this.concatRequiredRequest(
      this.commerceLogged,
      getWeek(this.selectedDay.date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      })
    );
    this.dismissModal(modalId);
  }

  dismissModal(modalId: string) {
    const modal: any = document.getElementById(modalId);
    if (modal) {
      modal.dismiss();
    }
  }

  getTodayWeek() {
    const startDay = startOfISOWeek(new Date());
    const nextDayWeek = startOfISOWeek(nextDay(startDay, 0));
    const lastDayWeek = endOfISOWeek(nextDayWeek);
    this.days = this.formatDateToDays(
      this.returnDaysOfWeek(nextDayWeek, lastDayWeek)
    );
  }

  getThisWeekDays() {
    const startDay = startOfISOWeek(this.selectedDay.date);
    const nextDayWeek = startOfISOWeek(nextDay(startDay, 0));
    const lastDayWeek = endOfISOWeek(nextDayWeek);
    this.days = this.formatDateToDays(
      this.returnDaysOfWeek(nextDayWeek, lastDayWeek)
    );
  }

  getNextWeekDays() {
    const endDay = endOfISOWeek(addWeeks(this.selectedDay.date, 0));
    const nextDayWeek = startOfISOWeek(nextDay(endDay, 0));
    const lastDayWeek = endOfISOWeek(nextDayWeek);
    const collection = this.returnDaysOfWeek(nextDayWeek, lastDayWeek);
    this.days = this.formatDateToDays(collection);
    this.selectedDay = this.days[0];
    this.concatRequiredRequest(
      this.commerceLogged,
      getWeek(this.selectedDay.date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      })
    );
    this.selectDate(this.selectedDay);
  }

  getPreviousWeekDays() {
    const startDay = startOfISOWeek(subWeeks(this.selectedDay.date, 0));
    const nextDayWeek = startOfISOWeek(previousDay(startDay, 0));
    const lastDayWeek = endOfISOWeek(nextDayWeek);
    const collection = this.returnDaysOfWeek(nextDayWeek, lastDayWeek);
    this.days = this.formatDateToDays(collection);
    this.selectedDay = this.days[0];
    this.concatRequiredRequest(
      this.commerceLogged,
      getWeek(this.selectedDay.date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      })
    );
    this.selectDate(this.selectedDay);
  }

  formatDateToDays(weekDays: Date[]): DayModel[] {
    const daysCollection: DayModel[] = [];
    weekDays.forEach((day: Date) => {
      const newDay: DayModel = new DayModel();
      newDay.date = day;
      newDay.dayNumber = getDate(day);
      newDay.name = format(day, 'EEEEE', { locale: es });
      newDay.shortName = format(day, 'EEE', { locale: es });
      newDay.month = getMonth(day);
      daysCollection.push(newDay);
    });
    return daysCollection;
  }

  public openBooking(value: { book: Booking; isBooking: boolean }): void {
    if (value.book.isBooking) {
      this.navCtrl.navigateForward([`booking/${value.book.uuid}`], {
        relativeTo: this.activatedRoute,
      });
    } else {
      if (open) {
        this.navCtrl.navigateForward([`non-availability/${value.book.uuid}`], {
          relativeTo: this.activatedRoute,
        });
      }
    }
  }
  async askSendSms(booking: Booking) {
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
    const newSms: SmsDto = new SmsDto();
    newSms.commerce = this.commerce;
    newSms.destination = [booking.customer.phone];
    newSms.message = `Hola ${booking.customer.name}, le informamos que su cita con ${this.commerce.name} se ha modificado con fecha ${format(date, "dd-MM-yyyy 'a las' HH:mm")}`;
    const alert = await this.alertController.create({
      header: '¿Desea notificar al cliente por SMS?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',

        },
        {
          text: 'Sí',
          role: 'confirm',
          handler: () => {
            this.bookingService.sendBookingNotification(newSms).subscribe((res) => console.log(res));
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }


  updateBooking(booking: Booking) {
    const employeeWorks = this.checkIfEmployeeWorks(this.employeeCollection, getDay(new Date(booking.startsDay)));
    const indexEmployee =
    Math.round(booking.mobilePosition.x /
    parseInt(localStorage.getItem('columnWidth'), 10));

    const employee = employeeWorks[indexEmployee];
    booking.asignedTo = employee;
    if (booking.isBooking) {
      if (!booking.customer.isWalkingClient && this.commerce.smsSent < this.commerce.smsAvailable) {
        this.askSendSms(booking);
      }
      this.bookingService.updateBooking(booking).subscribe((response) => {
        if (response) {
          this.concatRequiredRequest(
            this.commerceLogged,
            getWeek(this.selectedDay.date, {
              weekStartsOn: 1,
              firstWeekContainsDate: 4,
            })
          );
        }
      });

    } else {
      const nonAva: NonAvailabilityDto = new NonAvailabilityDto();
      nonAva.uuid = booking.uuid;
      nonAva.date = booking.startsDay;
      nonAva.commerce = booking.commerce;
      const scheduleHourStart: ScheduleHour = {
        hour: booking.startsHour,
        minute: booking.startsMinute,
      };
      const startDate: Date = new Date(
        2022,
        1,
        1,
        booking.startsHour,
        booking.startsMinute
      );
      const endDate: Date = addMinutes(startDate, booking.duration);

      const scheduleHourEnd: ScheduleHour = {
        hour: getHours(endDate),
        minute: getMinutes(endDate),
      };
      const timetable: IRangeTimeTable = {
        start: scheduleHourStart,
        end: scheduleHourEnd,
      };
      nonAva.timetable = JSON.stringify(timetable);
      nonAva.employee = booking.asignedTo;
      nonAva.message = booking.message;
      nonAva.week = booking.week;

      this.subscription.add(this.nonAvailabilityService
        .editNonAvailability(nonAva)
        .subscribe((response) => {
          if (response) {
            this.concatRequiredRequest(
              this.commerceLogged,
              getWeek(this.selectedDay.date, {
                weekStartsOn: 1,
                firstWeekContainsDate: 4,
              })
            );
          }
        }));
    }
  }
  checkIfEmployeeWorks(
    employeeCollection: Employee[],
    indexWeekDay: number
  ): Employee[] {
    if (employeeCollection.length > 1) {
      return employeeCollection.filter((employee: Employee) =>
        this.checkWeekDay(employee.timetable, indexWeekDay) && employee.isActive
      );
    }
    return employeeCollection;
  }
  checkWeekDay(timetableEmp: timetableSecond, indexWeekDay: number): boolean {
    const day = EDays[indexWeekDay];
    const range: IRangeTimeTable = JSON.parse(timetableEmp[day]);
    if (!range.start.hour) {
      return false;
    }
    return true;
  }
  buildTimetable(
    timeframes: FrameLabel[],
    bookings: Booking[],
    employee: Employee[],
    nonAvailability: NonAvailability[],
    freeTime: NonAvailability[],
    startOvertime: number,
    endOvertime: number,
    indexWeekDay: number,
    commerceTimetable: IRangeTimeTable
  ): TimeTable {
    const newTimeTable: TimeTable = new TimeTableBuilder()
      .setEmployees(employee)
      .setTimeFrames(timeframes)
      .setBookings(bookings)
      .setNonAvailability(nonAvailability)
      .setFreeTime(freeTime)
      .setStartOverTime(startOvertime)
      .setEndOverTime(endOvertime)
      .setIndexWeekDay(indexWeekDay)
      .setTimeTableCommerce(commerceTimetable)
      .build();
    return newTimeTable;
  }

  editBookingProcess(event: boolean) {
    if (event) {
      this.editBooking = true;
    } else {
      this.editBooking = false;
    }
  }

  editBookingConfirmation(action: boolean) {
    if (action) {
      this.editBookingService.editBookingConfirm.next(true);

    } else {
      this.editBookingService.editBookingConfirm.next(false);
      const timetableBackUp = [...this.timetable];
      this.timetable = [];

      this.concatRequiredRequest(
        this.commerceLogged,
        getWeek(this.selectedDay.date, {
          weekStartsOn: 1,
          firstWeekContainsDate: 4,
        })
      );
    }
  }

  overScrollEmitted(event: boolean) {
    if (event && !this.isAnimating) {
      this.overscroll = true;
      this.isAnimating = true;

      this.overmsg = 'Suelta para actualizar';
    }
  }

  overscrollEndEmitter(event: boolean) {
    this.overmsg = '';
    this.cd.detectChanges();
    setTimeout(() => {
      this.concatRequiredRequest(
        this.commerceLogged,
        getWeek(this.selectedDay.date, {
          weekStartsOn: 1,
          firstWeekContainsDate: 4,
        })
      );
    }, 2000);
  }

  goToNotifications(): void {
    const navigationExtras: NavigationExtras = {
      state: { notifications: this.notificationsCollection },
      relativeTo: this.activatedRoute,
    };
    this.navCtrl.navigateForward(['notifications'], navigationExtras);
  }

  ngOnDestroy(): void {
    this.timetable = null;
    this.subscription.unsubscribe();
  }

  mapTimeFramesToLabel(
    timeFrames: string[],
    commerceTimeTable: IRangeTimeTable
  ): FrameLabel[] {
      const frameLabelCollection: FrameLabel[] = [];
      const start = new Date(
        2022,
        0,
        1,
        commerceTimeTable.start.hour,
        commerceTimeTable.start.minute
      );
      const end =subMinutes(new Date(
        2022,
        0,
        1,
        commerceTimeTable.end.hour,
        commerceTimeTable.end.minute
      ),15);
      if(commerceTimeTable.start.hour){
      timeFrames.forEach((label: string) => {
        const labelSplit = label.split(':');
        const hour = Number(labelSplit[0]);
        const minute = Number(labelSplit[1]);
        const labelDate = new Date(2022, 0, 1, hour, minute);
        const frame: FrameLabel = {
          label,
          isOutOfRange:  isWithinInterval(labelDate, {
            start,
            end
          }),
        };
        frameLabelCollection.push(frame);
      });
    }else{
      timeFrames.forEach((label: string) => {
        const labelSplit = label.split(':');
        const hour = Number(labelSplit[0]);
        const minute = Number(labelSplit[1]);
        const labelDate = new Date(2022, 0, 1, hour, minute);
        const frame: FrameLabel = {
          label,
          isOutOfRange:  false
        };
        frameLabelCollection.push(frame);
      });
    }
      return frameLabelCollection;
  }

}
