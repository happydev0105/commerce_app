import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO, eachDayOfInterval, addDays, isThisSecond, getDay, getWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { Subscription } from 'rxjs';
import { NonAvailabilityDto } from 'src/app/core/dto/non-availability.dto';
import { EDays } from 'src/app/core/enums/days.enum';
import { Longpress } from 'src/app/core/interfaces/longpress.interface';
import { INonAvailability } from 'src/app/core/interfaces/non-availability.interface';
import { IRangeTimeTable } from 'src/app/core/interfaces/rangeTimetable.interface';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { TimeTable } from 'src/app/core/models/timeTable/timeTable.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
import { NonAvailabilityService } from 'src/app/core/services/non-availability/non-availability.service';
import { TimeTableService } from 'src/app/core/services/timeTable/time-table.service';
import { DateService } from 'src/app/core/utils/date.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.page.html',
  styleUrls: ['./holiday.page.scss'],
})
export class HolidayPage implements OnInit, OnDestroy {

  @ViewChild(IonDatetime) datetime: IonDatetime;
  @ViewChild(IonDatetime) time: IonDatetime;
  @ViewChild(AlertComponent) deleteAlert: AlertComponent;
  form: FormGroup;
  showPickerDate = false;
  dateStartValue: string;
  dateEndValue: string;
  isEdit = false;
  editItem: INonAvailability;
  title: string;
  id: string;
  startDate: Date;
  endDate: Date;
  commerceLogged: string;
  nonAvailabilityData: Longpress;
  employeeSelected: Employee;
  commerceTimetable: TimeTable;
  locale = es;
  subscription: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    public dateService: DateService,
    private nonAvailabilityService: NonAvailabilityService,
    private employeeService: EmployeeService,
    private timeTableService: TimeTableService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private authService: AuthService) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
    this.initForm();

  }

  get startDay() {
    return this.form.get('startDay');
  }
  get endDay() {
    return this.form.get('endDay');
  }
  get message() {
    return this.form.get('message');
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ngOnInit() {
    this.getParam();
    this.getCommerceTimetableById(this.commerceLogged);
  }

  getParam() {
    this.subscription.add(this.activatedRoute.params.subscribe((param: Params) => {
      this.subscription.add(this.employeeService.findEmployeeById(param.id).subscribe((res: Employee) => {
        this.employeeSelected = res;

      }));
    }));
  }

  getCommerceTimetableById(commerceUuid: string) {
    this.subscription.add(this.timeTableService.findTimetableOnlyEntityByCommerce(commerceUuid).subscribe((res: TimeTable) => {
      this.commerceTimetable = res;
      console.log('timetable', res);
    }));
  }

  dateChangedInit(value: string) {
    this.startDate = new Date(value);
    this.dateStartValue = format(parseISO(value), 'd MMM, yyyy', { locale: es });
    this.startDay.setValue(this.startDate.toISOString());
    this.endDay.setValue(this.startDate.toISOString());

  }
  dateEndChanged(value: string) {
    this.endDate = new Date(value);
    this.dateEndValue = format(parseISO(value), 'd MMM, yyyy', { locale: es });
  }
  dismiss() {
    this.datetime.cancel(true);
  }
  dismissModal(modalId: string) {
    const modal: any = document.getElementById(modalId);
    if (modal) { modal.dismiss(); }
  }
  select() {
    this.datetime.confirm(true);
  }
  dismissTime() {
    this.time.cancel(true);
  }
  selectTime() {
    this.time.confirm(true);
  }

  alertBox(value: boolean) {
    if (value) {
      this.deleteItem();
    }
  }
  openAlert() {
    this.deleteAlert.presentAlertConfirm();
  }
  deleteItem() {
    this.subscription.add(this.nonAvailabilityService
      .deleteNonAvailabilityById(this.id)
      .subscribe((res: any) => {
        if (res.affected > 0) {
          this.location.back();
        }
      }));
  }
  onSubmit() {
    const nonAvailabilityDto: NonAvailabilityDto[] = this.buildNonAvailability();

    nonAvailabilityDto.forEach((item: NonAvailabilityDto, index: number) => {
      console.log(index, nonAvailabilityDto.length);
      if (this.isEdit) {
        this.subscription.add(this.nonAvailabilityService
          .editNonAvailability(item)
          .subscribe((res: INonAvailability) => {
            if (res && index === nonAvailabilityDto.length - 1) {

              this.location.back();
            }
          }));
      } else {
        this.subscription.add(this.nonAvailabilityService
          .saveNonAvailability(item)
          .subscribe((res: INonAvailability) => {
            if (res && index === nonAvailabilityDto.length - 1) {

              this.location.back();
            }
          }));
      }
    });

  }

  ionViewDidLeave() {

  }
  ngOnDestroy(): void {
    this.form.reset();
    this.subscription.unsubscribe();
  }
  private initForm() {
    this.form = this.fb.group({
      startDay: [format(new Date(), 'yyyy-MM-dd', { locale: es }), Validators.required],
      endDay: [format(addDays(new Date(), 1), 'yyyy-MM-dd', { locale: es }), Validators.required],

    });
  }

  private buildNonAvailability(): NonAvailabilityDto[] {
    const interval = eachDayOfInterval({ start: this.startDate, end: this.endDate });
    const uniqueID = '_' + Math.random().toString(36).substring(2, 9);
    const dayCollection: NonAvailabilityDto[] = [];
    interval.forEach((item: Date) => {
      const weekDay = EDays[getDay(item)];
      const newNonAvailability: NonAvailabilityDto = new NonAvailabilityDto();
      newNonAvailability.commerce = this.commerceLogged;
      newNonAvailability.employee = this.employeeSelected;
      const startDate = new Date(item);
      newNonAvailability.date = this.dateService.formatDate(startDate);
      if (this.isEdit) {
        newNonAvailability.uuid = this.editItem.uuid;
      }
      const timetable: IRangeTimeTable = {
        start: {
          hour: JSON.parse(this.commerceTimetable[weekDay]).start.hour,
          minute: JSON.parse(this.commerceTimetable[weekDay]).start.minute,
        },
        end: {
          hour: JSON.parse(this.commerceTimetable[weekDay]).end.hour,
          minute: JSON.parse(this.commerceTimetable[weekDay]).end.minute,
        },
      };
      newNonAvailability.timetable = JSON.stringify(timetable);
      newNonAvailability.groupBy = uniqueID;
      newNonAvailability.message = 'Vacaciones';
      newNonAvailability.week = getWeek(startDate, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      });
      dayCollection.push(newNonAvailability);
    });
    return dayCollection;
  }

}
