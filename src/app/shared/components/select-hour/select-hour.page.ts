import { AlertController, NavController } from '@ionic/angular';
import { format, formatISO, milliseconds } from 'date-fns';
import { UpdateTimeTableDayDto } from '../../../core/models/timeTable/update-timeTable-day.dto';
import { TimeTable } from '../../../core/models/timeTable/timeTable.model';
import { TimeTableTransformer } from 'src/app/core/transformers/timeTable.transformer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TimeTableService } from 'src/app/core/services/timeTable/time-table.service';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { ScheduleDay } from 'src/app/core/interfaces/schedule-day.interface';
import { IRangeTimeTable } from 'src/app/core/interfaces/rangeTimetable.interface';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-select-hour',
  templateUrl: './select-hour.page.html'
})
export class SelectHourPage implements OnInit, OnDestroy {

  @ViewChild('datetimeEntrance', { static: false }) datetimeEntrance;

  day: string;
  openingHours: string[] = [];
  hourForm: FormGroup;
  addTurn = false;
  timetableDay: TimeTable;
  scheduleDay: { checkinHour: string; departureHour: string; checkinRestHour: string; departureRestHour: string };
  actualDate = new Date();
  timetableId: string;
  newEmployee = false;
  isCommerce = false;
  isWizard = false;
  commerceTimeTable: ScheduleDay;
  currentUser: Employee;
  routeBack: string;
  alert: HTMLIonAlertElement;
  errorMessage: string;
  subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private timeTableService: TimeTableService,
    private alertController: AlertController,
    private navCtrl: NavController) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.initForms();
    if (this.router.getCurrentNavigation().extras.state) {
      this.day = this.router.getCurrentNavigation().extras.state.day;
      this.isCommerce = this.router.getCurrentNavigation().extras.state.isCommerce;
      if (!this.isCommerce) {
        this.getCommerceTimetable(this.currentUser.commerce);
      }
      this.scheduleDay = this.router.getCurrentNavigation().extras.state.scheduleDay;
      if (!this.scheduleDay.checkinRestHour || this.scheduleDay.checkinHour.includes('null')) {
        this.scheduleDay.checkinHour = this.scheduleDay.checkinHour.substring(this.scheduleDay.checkinHour.length - 1, 0);
      }
      this.timetableId = this.router.getCurrentNavigation().extras.state.timetableId;
      this.newEmployee = this.router.getCurrentNavigation().extras.state.newEmployee;
      this.isWizard = this.router.getCurrentNavigation().extras.state.isWizard;
      this.routeBack = this.router.getCurrentNavigation().extras.state.routeBack;
      this.setValuesFromDay();

    }
  }


  get isAvailable() {
    return this.hourForm.get('isAvailable');
  }

  get checkin() {
    return this.hourForm.get('checkin');
  }

  get departure() {
    return this.hourForm.get('departure');
  }

  get restStart() {
    return this.hourForm.get('restStart');
  }

  get restEnd() {
    return this.hourForm.get('restEnd');
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(){
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ngOnInit() { }

  getCommerceTimetable(commerceID: string) {
    this.subscription.add(this.timeTableService.findTimetableOnlyEntityByCommerce(commerceID)
      .subscribe((res: TimeTable) => {
        this.commerceTimeTable = TimeTableTransformer.toRangeTable(res);
      }));
  }


  calculateMinMaxRestHours(type: string) {
    let hourSplitted = '';
    const year = this.actualDate.getFullYear();
    const month = this.actualDate.getMonth();
    const day = this.actualDate.getDate();
    let hour = 0;
    let minutes = 0;
    // la hora máxima de hora de entrada descanso es si existe la hora de salida de descanso -15 o sino la hora de salida -15
    if (type === 'checkin_rest') {
      hourSplitted = this.restEnd.value ? this.restEnd.value.split(':') : this.departure.value.split(':');
      hour = Number.parseInt(hourSplitted[0], 10);
      minutes = Number.parseInt(hourSplitted[1], 10) - 15;
    } else if (type === 'departure_rest') {
      hourSplitted = this.restStart.value ? this.restStart.value.split(':') : this.checkin.value.split(':');
      hour = Number.parseInt(hourSplitted[0], 10);
      minutes = Number.parseInt(hourSplitted[1], 10) + 15;
    }
    const dateFormatted = formatISO(new Date(year, month, day, hour, minutes), { representation: 'time' });
    return dateFormatted;
  }

  formatIsoDate(type: string) {
    let hourSplitted = '';
    hourSplitted = this.scheduleDay[type].split(':');
    const year = this.actualDate.getFullYear();
    const month = this.actualDate.getMonth();
    const day = this.actualDate.getDate();
    const hour = hourSplitted[0] && hourSplitted[0] !== 'null' ? Number.parseInt(hourSplitted[0], 10) : this.actualDate.getHours();
    const minute = hourSplitted[0] && hourSplitted[1] !== 'null' ? Number.parseInt(hourSplitted[1], 10) : this.actualDate.getMinutes();

    const dateFormatted = formatISO(new Date(year, month, day, hour, minute), { representation: 'time' });
    return dateFormatted;
  }

  formatIsoDateTime(range: IRangeTimeTable, type: string): string {
    const hourRange = range[type].hour;
    const minuteRange = range[type].minute;
    const year = this.actualDate.getFullYear();
    const month = this.actualDate.getMonth();
    const day = this.actualDate.getDate();
    const hour = hourRange !== null ? hourRange : this.actualDate.getHours();
    const minute = minuteRange !== null ? minuteRange : this.actualDate.getMinutes();

    const dateFormatted = format(new Date(year, month, day, hour, minute), 'HH:mm');
    return dateFormatted;
  }

  /* calculateMinMaxHour(type: string) {
    const currentHour = this.actualDate.getHours() + ':' + this.actualDate.getMinutes(),
      currentNextHour = (this.actualDate.getHours() + 1) + ':' + this.actualDate.getMinutes();
    const departureHourSplitted = this.departure.value ? this.departure.value.split(':') : currentHour.split(':'),
      checkinHourSplitted = this.checkin.value ? this.checkin.value.split(':') : currentNextHour.split(':');
    const year = this.actualDate.getFullYear(),
    month = this.actualDate.getMonth(),
    day = this.actualDate.getDate();
    let hour = 0,
      minutes = 0;
    if (type === 'checkin') {
      hour = Number.parseInt(departureHourSplitted[0]);
      minutes = Number.parseInt(departureHourSplitted[1]);
      if (this.addTurn) {
        this.calculateMinMaxHour('checkin_rest');
        this.calculateMinMaxHour('departure_rest');
      }
    } else if (type === 'departure') {
      hour = Number.parseInt(checkinHourSplitted[0]) + 1;
      minutes = Number.parseInt(checkinHourSplitted[1]);
      if (this.addTurn) {
        this.calculateMinMaxHour('checkin_rest');
        this.calculateMinMaxHour('departure_rest');
      }
    } else if (type === 'checkin_rest') {
      hour = Number.parseInt(checkinHourSplitted[0]);
      minutes = Number.parseInt(checkinHourSplitted[1] + 15);
    } else {
      hour = Number.parseInt(departureHourSplitted[0]);
      minutes = Number.parseInt(departureHourSplitted[1]) - 15;
    }
    console.log('year: ', year);
    console.log('month: ', month);
    console.log('day: ', day);
    console.log('hour: ', hour);
    console.log('minutes: ', minutes);
    console.log('fecha: ', new Date(year, month, day, hour, minutes));
    const dateFormatted = formatISO(new Date(year, month, day, hour, minutes), { representation: 'time' });
    console.log('dateFormatted: ', dateFormatted);
    return dateFormatted;
  } */


  async presentAlertModal() {
    if (this.isCommerce && !this.isWizard) {
      this.alert = await this.alertController.create({
        header: 'Atención',
        message: 'La modificación del horario del comercio, repercutirá en los horarios de sus empleados. ¿Desea continuar?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.alert.dismiss();
            }
          },
          {
            text: 'Aceptar',
            role: 'confirm',
            handler: () => { this.saveHourDay(); }
          }
        ]
      });

      await this.alert.present();
    }
    else {
      this.saveHourDay();
    }

  }

  saveHourDay() {
    let transformedHour = '';
    if (this.isAvailable.value) {
      if (this.addTurn) {
        transformedHour = TimeTableTransformer.to(
          this.checkin.value, this.departure.value,
          this.restStart.value, this.restEnd.value);
      } else {
        transformedHour = TimeTableTransformer.to(this.checkin.value, this.departure.value);
      }
    } else {
      transformedHour = TimeTableTransformer.createCloseDay();
    }
    const updateDayDto: UpdateTimeTableDayDto = {
      uuid: this.timetableId,
      day: this.day,
      timetable: transformedHour
    };
    if (this.newEmployee) {
      this.timeTableService.updateObservableNewEmployee(updateDayDto);
    } else if (this.isWizard) {

      this.updateTimeTableCommerce(updateDayDto);
      const updateDayDtoUser: UpdateTimeTableDayDto = {
        uuid: this.currentUser.timetable.uuid,
        day: this.day,
        timetable: transformedHour
      };
      this.updateTimeTableEmployeeGerente(updateDayDtoUser);
    } else {
      if (this.isCommerce) {


        this.subscription.add(this.timeTableService.updateTimeTableDayCommerce(updateDayDto).subscribe(response => {
          if (response) {
            this.timeTableService.updateObservable(response);

          }
        }));
      } else {

        const updateDayEmployeeDto: UpdateTimeTableDayDto = {
          uuid: this.timetableId,
          day: this.day,
          timetable: transformedHour
        };

        this.subscription.add(this.timeTableService.updateTimeTableDay(updateDayEmployeeDto).subscribe(response => {
          if (response) {
            this.timeTableService.updateObservable(response);

          }
        }));
      }

    }
    this.cancel();
  }

  updateTimeTableCommerce(updateDayDto: UpdateTimeTableDayDto) {
    this.subscription.add(this.timeTableService.updateTimeTableDay(updateDayDto).subscribe(response => {
      if (response) {
        this.timeTableService.updateObservable(response);
      }
    }));
  }

  updateTimeTableEmployeeGerente(updateDayDtoUser: UpdateTimeTableDayDto) {
    this.subscription.add(this.timeTableService.updateTimeTableDay(updateDayDtoUser).subscribe(response => {
      if (response) {
      }
    }));
  }

  onChangeHour(event, typeHour: string) {
    this[typeHour].setValue(event);
    this.validateLogicHour();
  }

  setDefaultOpeningHours(): string[] {
    const hour = [];
    for (let i = 8; i < 24; i++) {
      hour.push(i.toString());
    }
    return hour;
  }



  dismissModal(modalId: string) {
    const modal: any = document.getElementById(modalId);
    if (modal) {
      modal.dismiss();
    }
  }

  cancel() {
    this.navCtrl.back();
  }

  validateLogicHour(): boolean {
    if (this.isAvailable.value === true) {
      if (this.restEnd.value !== '' && this.restStart.value !== '' && this.addTurn) {
        this.errorMessage = 'Por favor rellene los campos vacíos.'
        const restStart = milliseconds({hours: this.restStart.value.split(':')[0], minutes: this.restStart.value.split(':')[1]});
        const restEnd = milliseconds({hours: this.restEnd.value.split(':')[0], minutes: this.restEnd.value.split(':')[1]});
        if (restEnd < restStart || restEnd === restStart) {
          this.errorMessage = 'Por favor, introduzca un horario lógico'
          return true;
        }
      }

      if ((this.departure.value === '' && this.checkin.value === '') && (this.restEnd.value === '' && this.restStart.value === '')) {
        this.errorMessage = 'Por favor rellene los campos vacíos.' ;
        return true;
      } else if ((this.restEnd.value === '' && this.restStart.value !== '')) {
        this.errorMessage = 'Por favor rellene los campos vacíos.';
        return true;
      }
      else {
        const checkin = milliseconds({hours: this.checkin.value.split(':')[0], minutes: this.checkin.value.split(':')[1]});
        const departure = milliseconds({hours: this.departure.value.split(':')[0], minutes: this.departure.value.split(':')[1]});
        if (departure < checkin || departure === checkin) {
          this.errorMessage = 'Por favor, introduzca un horario lógico';
          return true;
        }
      }
      if (this.addTurn && this.restEnd.value === '' && this.restStart.value === ''){
        this.errorMessage = 'Por favor rellene los campos vacíos.';
        return true;
      }
    }
    return false;
  }

  toogle(event) {
    this.isAvailable.setValue(event.detail.checked)
  }

  private initForms() {
    this.hourForm = this.formBuilder.group({
      isAvailable: [true, Validators.required],
      checkin: ['', Validators.required],
      departure: ['', Validators.required],
      restStart: [''],
      restEnd: ['']
    }, { updateOn: 'blur' });
  }
  private setValuesFromDay() {
    if (!this.scheduleDay.checkinHour || this.scheduleDay.checkinHour.includes('null')) {
      this.checkin.setValue('');
      this.departure.setValue('');
      this.restStart.setValue('');
      this.restEnd.setValue('');
      this.isAvailable.setValue(false);
    } else {
      if (this.scheduleDay.checkinRestHour) {
        this.restStart.setValue(this.scheduleDay.checkinRestHour);
        this.restEnd.setValue(this.scheduleDay.departureRestHour);
        this.addTurn = true;
      }
      this.checkin.setValue(this.scheduleDay.checkinHour);
      this.departure.setValue(this.scheduleDay.departureHour);
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
