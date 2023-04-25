/* eslint-disable max-len */
import { Longpress } from '../../../core/interfaces/longpress.interface';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, IonModal, NavController, PickerColumn, PickerColumnOption, PickerController } from '@ionic/angular';
import { addHours, format, getDay, getHours, getMinutes, getWeek, isWithinInterval, parseISO } from 'date-fns';
import { NonAvailabilityDto } from 'src/app/core/dto/non-availability.dto';
import { DateService } from 'src/app/core/utils/date.service';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
import { NonAvailabilityService } from 'src/app/core/services/non-availability/non-availability.service';
import { IRangeTimeTable } from 'src/app/core/interfaces/rangeTimetable.interface';
import { INonAvailability } from 'src/app/core/interfaces/non-availability.interface';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { es } from 'date-fns/locale';
import { EDays } from 'src/app/core/enums/days.enum';
import { ScheduleDay } from 'src/app/core/interfaces/schedule-day.interface';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-non-availability',
  templateUrl: './non-availability.page.html',
  styleUrls: ['./non-availability.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NonAvailabilityPage implements OnInit, OnDestroy {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  @ViewChild(IonDatetime) time: IonDatetime;
  @ViewChild(AlertComponent) deleteAlert: AlertComponent;
  @ViewChild(IonModal) modal: IonModal;
  form: FormGroup;
  showPickerDate = false;
  employeeCollection: Employee[] = [];
  dateValue: string;
  timeValue: string;
  isEdit = false;
  editItem: INonAvailability;
  title: string;
  id: string;
  commerceLogged: string;
  nonAvailabilityData: Longpress;
  locale = es;
  selectedDay: string;
  noclick = false;
  subscription: Subscription = new Subscription();
  pickerColumns: PickerColumn[];
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    public dateService: DateService,
    private nonAvailabilityService: NonAvailabilityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private pickerCtrl: PickerController,
    private cdr: ChangeDetectorRef,
    private utilsService: UtilsService,
    private toast: ToastService
  ) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;

    if (this.router.getCurrentNavigation().extras.state) {
      if (this.router.getCurrentNavigation().extras.state.bookingData) {
        this.nonAvailabilityData = this.router.getCurrentNavigation().extras.state.bookingData;

      }
      this.selectedDay = this.router.getCurrentNavigation().extras.state.selectedDay;


    }


  }
  get startDay() {
    return this.form.get('startDay');
  }
  get startHour() {
    return this.form.get('startHour');
  }
  get endHour() {
    return this.form.get('endHour');
  }
  get message() {
    return this.form.get('message');
  }
  get employee() {
    return this.form.get('employee');
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }



  ionViewWillEnter() {
    this.pickerColumns = this.generateHoursColum();
    this.findEmployeeCollection(this.commerceLogged);

  }

  ngOnInit() {

    this.cdr.detectChanges();
    this.title = 'Crear reserva de tiempo';
  }
  getParam() {
    if (this.activatedRoute.snapshot.params.id) {
      this.title = 'Editar reserva de tiempo';
      this.subscription.add(this.activatedRoute.params.subscribe((res: Params) => {
        this.id = res.id;
        this.subscription.add(this.nonAvailabilityService
          .getNonAvailabilityById(res.id)
          .subscribe((nonAva: INonAvailability) => {
            this.editItem = nonAva;
            this.isEdit = true;
            const dateSplit = nonAva.date.split('-');
            const timetable: IRangeTimeTable = JSON.parse(nonAva.timetable);
            const date = new Date(
              parseInt(dateSplit[0], 10),
              parseInt(dateSplit[1], 10) - 1,
              parseInt(dateSplit[2], 10),
              timetable.start.hour,
              timetable.start.minute
            );
            const enddate = new Date(
              parseInt(dateSplit[0], 10),
              parseInt(dateSplit[1], 10) - 1,
              parseInt(dateSplit[2], 10),
              timetable.end.hour,
              timetable.end.minute
            );

            this.startDay.setValue(format(date, 'yyyy-MM-dd', { locale: es }));
            this.startHour.setValue(format(date, 'HH:mm'));
            this.endHour.setValue(format(enddate, 'HH:mm'));

            const weekDay = EDays[getDay(new Date(this.startDay.value))];
            this.employeeCollection = this.employeeCollection
              .filter(employee => employee.isEmployee && employee.isActive && JSON.parse(employee.timetable[weekDay]).start.hour !== null).sort((a: Employee, b: Employee) =>
              a.order < b.order ? -1 : 1
            );

            this.dateChanged(date.toJSON());
            this.timeChanged(enddate.toJSON());
            this.selectedEmployee(nonAva.employee.uuid);
            this.message.setValue(nonAva.message);
            this.nonAvailabilityData = {
              selectedDay:  null,
              selectedHour: {hours: getHours(date),
                minutes: getMinutes(date)}};
            this.pickerColumns = this.generateHoursColum();

          }));
      }));
    } else {
      this.title = 'Crear reserva de tiempo';
    }
  }
  findEmployeeCollection(commerce: string) {
    this.subscription.add(this.employeeService
      .findEmployees(commerce)
      .subscribe((res: Employee[]) => {
        this.getParam();

        this.employeeCollection = res.sort((a: Employee, b: Employee) =>
        a.order < b.order ? -1 : 1
      );
        this.initForm();
        this.calcMaxEndHour();
        this.cdr.detectChanges();
      }));
  }
  dateChanged(value: string) {
    this.dateValue = format(parseISO(value), 'HH:mm  d MMM, yyyy');
    this.modal.dismiss();
  }
  timeChanged(value) {
    this.timeValue = format(parseISO(value), 'HH:mm ');

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
  cancel() {
    this.navCtrl.navigateBack(['tabs/home'], { replaceUrl: true });
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
          this.cancel();
        }
      }));
  }
  onSubmit() {
    const nonAvailabilityDto: NonAvailabilityDto = this.buildNonAvailability();
    if (this.isEdit) {
      this.subscription.add(this.nonAvailabilityService
        .editNonAvailability(nonAvailabilityDto)
        .subscribe((res: INonAvailability) => {
          if (res) {
            this.cancel();
          }
        }));
    } else {
      this.subscription.add(this.nonAvailabilityService
        .saveNonAvailability(nonAvailabilityDto)
        .subscribe((res: INonAvailability) => {
          if (res) {
            this.cancel();
          }
        }));
    }
  }
  onChangeStartHour(event) {
    if (event !== undefined) {
      const hourSelected: string = event;
      if (hourSelected?.length > 0) {
        this.startHour.setValue(hourSelected.split(':')[0] + ':' + hourSelected.split(':')[1]);
      }
    }
  }
  onChangeEndHour(event) {
    if (event !== undefined) {
      const hourSelected: string = event.split('T')[1];
      if (hourSelected?.length > 0) {
        this.endHour.setValue(hourSelected.split(':')[0] + ':' + hourSelected.split(':')[1]);
      }
    }
  }
  selectedEmployee(value) {
    this.employee.setValue(value);
    this.calcMaxEndHour();

  }
  ionViewDidLeave() {
    this.cancel();
  }
  ngOnDestroy(): void {
    this.form.reset();
    this.subscription.unsubscribe();
  }
  setSelectedStartHour(hourSelected: string) {
    this.startHour.setValue(hourSelected);
    this.onChangeStartHour(hourSelected);
  }

  setSelectedEndHour(hourSelected: string) {
    this.endHour.setValue(hourSelected);
    //this.calculateTimeBetweenEndAndStart();
  }


  //Calc max endHour
  calcMaxEndHour(): IRangeTimeTable {

    if (!this.employee.value) {
      const commerce: Commerce = JSON.parse(localStorage.getItem('currentCommerce'));
      const commerceTimetable: ScheduleDay = this.utilsService.getTimetableByCommerce(commerce);
      const weekDay = EDays[getDay(new Date(this.selectedDay))];
      return commerceTimetable[weekDay];

    } else {
      const employeeTimetable: ScheduleDay = this.utilsService.getTimetableByEmployeeId(this.employee.value, this.employeeCollection);
      const weekDay = EDays[getDay(new Date(this.selectedDay))];

      return employeeTimetable[weekDay];
    }

  }

  checkIfSelectedHourIsOutOfRange(start: IRangeTimeTable, end: IRangeTimeTable): boolean {

    const startDate: Date = new Date(2022, 0, 1, start.start.hour, start.start.minute);
    const endDate: Date = new Date(2022, 0, 1, end.end.hour, end.end.minute);
    const selectedDate: Date = new Date(2022, 0, 1, this.startHour.value.split(':')[0], this.startHour.value.split(':')[1]);

    return isWithinInterval(selectedDate, { start: startDate, end: endDate });
  }

   initForm() {

    this.form = this.fb.group({
      startDay: [
        this.nonAvailabilityData ?
          format(new Date(this.nonAvailabilityData.selectedDay.date), 'yyyy-MM-dd', { locale: es }) :
          this.selectedDay, Validators.required],
      startHour: [
        this.nonAvailabilityData ?
          format(new Date(2022, 1, 1, this.nonAvailabilityData.selectedHour.hours, this.nonAvailabilityData.selectedHour.minutes),
            'HH:mm', { locale: es }) :
          ''
        , Validators.required],
      endHour: [
        this.nonAvailabilityData ?
          format(addHours(new Date(2022, 1, 1, this.nonAvailabilityData.selectedHour.hours, this.nonAvailabilityData.selectedHour.minutes), 1),
            'HH:mm', { locale: es }) :
          '',
        Validators.required],
      message: [''],
      employee: [this.nonAvailabilityData ? this.nonAvailabilityData.employee.uuid : '', Validators.required],
    });

  }

   buildNonAvailability(): NonAvailabilityDto {
    const newNonAvailability: NonAvailabilityDto = new NonAvailabilityDto();
    newNonAvailability.commerce = this.commerceLogged;
    newNonAvailability.employee = this.employee.value;
    newNonAvailability.week = getWeek(new Date(this.startDay.value), { weekStartsOn: 1, firstWeekContainsDate: 4 });
    const startDate = new Date(this.startDay.value);
    newNonAvailability.date = this.dateService.formatDate(startDate);
    if (this.isEdit) {
      newNonAvailability.uuid = this.editItem.uuid;
    }
    const timetable: IRangeTimeTable = {
      start: {
        hour: parseInt(this.startHour.value.split(':')[0], 10),
        minute: parseInt(this.startHour.value.split(':')[1], 10),
      },
      end: {
        hour: parseInt(this.endHour.value.split(':')[0], 10),
        minute: parseInt(this.endHour.value.split(':')[1], 10),
      },
    };
    newNonAvailability.timetable = JSON.stringify(timetable);
    newNonAvailability.message = this.message.value;
    return newNonAvailability;
  }
  async openPickerStartHour() {
    const picker = await this.pickerCtrl.create({
      columns: this.pickerColumns,
      cssClass: 'my-picker',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: (value) => {
            this.setSelectedStartHour(`${value.hours.value}:${value.minutes.value}`);
            this.cdr.detectChanges();
          },
        },
      ],
    });

    await picker.present();
  }
  async openPickerEndHour() {
    const picker = await this.pickerCtrl.create({
      columns: this.pickerColumns,
      cssClass: 'my-picker',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: (value) => {
           this.setSelectedEndHour(`${value.hours.value}:${value.minutes.value}`);
            this.cdr.detectChanges();
          },
        },
      ],
    });

    await picker.present();
  }

  generateHoursColum(): PickerColumn[]{
    let selectedHour = 0;
    let selectedMinutes = 0;
    const optionsHourCollection: PickerColumnOption[] = [];
    const optionsMinutesCollection: PickerColumnOption[] = [];
    const hoursCollection: string[] = this.utilsService.generateHours(0, 23);
    const minutesCollection: string[] =this.utilsService.generateMinutes();
    hoursCollection.forEach((value: string, index: number) => {
      if(this.nonAvailabilityData?.selectedHour.hours.toString() === value) {
        selectedHour = index;
      }
      const newoption: PickerColumnOption = {
        text: `${value} h`,
        value,
        selected: this.nonAvailabilityData?.selectedHour.hours.toString() === value ? true: false
      };
      optionsHourCollection.push(newoption);
    });
    minutesCollection.forEach((value: string, index: number) => {
      if(this.nonAvailabilityData?.selectedHour.minutes.toString() === value) {
        selectedMinutes = index;
      }
      const newoption: PickerColumnOption = {
        text: `${value} min`,
        value,
        selected: this.nonAvailabilityData?.selectedHour.minutes.toString() === value  ? true: false
      };
      optionsMinutesCollection.push(newoption);
    });
    const newColumnHour: PickerColumn = {
      name: 'hours',
      options: optionsHourCollection,
      columnWidth: '50%',
      selectedIndex: selectedHour
    };
    const newColumnMinute: PickerColumn = {
      name: 'minutes',
      options: optionsMinutesCollection,
      columnWidth: '50%',
      selectedIndex: selectedMinutes
    };
    
    return [newColumnHour,newColumnMinute];
  }

}
