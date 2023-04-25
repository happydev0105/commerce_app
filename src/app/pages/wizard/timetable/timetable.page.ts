import { NavController } from '@ionic/angular';
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ScheduleDay } from 'src/app/core/interfaces/schedule-day.interface';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { TimeTable } from 'src/app/core/models/timeTable/timeTable.model';
import { CommerceService } from 'src/app/core/services/commerce/commerce.service';
import { TimeTableService } from 'src/app/core/services/timeTable/time-table.service';
import { TimeTableTransformer } from 'src/app/core/transformers/timeTable.transformer';
import { DateService } from 'src/app/core/utils/date.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.page.html',
  styleUrls: ['./timetable.page.scss'],
})
export class TimetablePage implements OnInit, OnDestroy {
  timeTableForm: FormGroup;
  currentUser: Employee;
  commerce: Commerce;
  weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  schedule: ScheduleDay;
  subscription: Subscription = new Subscription();

  constructor(
    private timeTableService: TimeTableService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private commerceService: CommerceService,
    private dateService: DateService,
    private formBuilder: FormBuilder,) {
    this.initTimeTableForm();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getCommerceData();
    this.subscription.add(this.timeTableService.updateHourday$.subscribe(response => {
      this.setDefaultHours(response);
    }));
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(){
    const selection = window.getSelection();
    selection.removeAllRanges();
  }
  ngOnInit() {
  }

  getCommerceData() {
    this.subscription.add(this.commerceService.getCommerceInfoById(this.currentUser.commerce).subscribe(response => {
      if (response) {
        localStorage.setItem('currentCommerce', JSON.stringify(response));
        this.commerce = response;
        this.setDefaultHours(this.commerce.timetable);
      }
    }));
  }

  goToNext() {
    this.navCtrl.navigateForward(['wizard/services']);
  }

  initTimeTableForm() {
    this.timeTableForm = this.formBuilder.group({
      monday: [true, Validators.required],
      checkinTimemonday: ['', Validators.required],
      departureTimemonday: ['', Validators.required],
      tuesday: [true, Validators.required],
      checkinTimetuesday: ['', Validators.required],
      departureTimetuesday: ['', Validators.required],
      wednesday: [true, Validators.required],
      checkinTimewednesday: ['', Validators.required],
      departureTimewednesday: ['', Validators.required],
      thursday: [true, Validators.required],
      checkinTimethursday: ['', Validators.required],
      departureTimethursday: ['', Validators.required],
      friday: [true, Validators.required],
      checkinTimefriday: ['', Validators.required],
      departureTimefriday: ['', Validators.required],
      saturday: [true, Validators.required],
      checkinTimesaturday: ['', Validators.required],
      departureTimesaturday: ['', Validators.required],
      sunday: [true, Validators.required],
      checkinTimesunday: ['', Validators.required],
      departureTimesunday: ['', Validators.required],
    });
  }

  setDefaultHours(timetable: TimeTable) {
    this.schedule = TimeTableTransformer.toRangeTable(timetable);
    for (const day in this.schedule) {
      const checkinHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].start.hour}:${this.schedule[day].start.minute}`);
      const departureHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].end.hour}:${this.schedule[day].end.minute}`);
      if (this.schedule[day].rest) {
        const checkinRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.start.hour}:${this.schedule[day].rest.start.minute}`);
        const departureRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.end.hour}:${this.schedule[day].rest.end.minute}`);
        this.timeTableForm.get(`checkinTime${day}`).setValue(`${checkinHour}-${checkinRestHour} | ${departureRestHour}-${departureHour}`);
        this.timeTableForm.get(`departureTime${day}`).setValue('');
      } else {
        this.timeTableForm.get(`checkinTime${day}`).setValue(`${checkinHour}-`);
        this.timeTableForm.get(`departureTime${day}`).setValue(departureHour);
      }
      this.timeTableForm.get(day).setValue(!checkinHour.includes('null') ? true : false);
    }
    this.schedule.uuid = timetable.uuid;
  }

  goToConfigureSchedule(day: string) {
    const timetableId = this.schedule.uuid;
    const scheduleDay = {
      checkinHour: this.timeTableForm.get(`checkinTime${day}`).value,
      departureHour: this.timeTableForm.get(`departureTime${day}`).value,
      checkinRestHour: '',
      departureRestHour: ''
    };
    if (this.schedule[day].rest) {
      scheduleDay.checkinHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].start.hour}:${this.schedule[day].start.minute}`);
      scheduleDay.departureHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].end.hour}:${this.schedule[day].end.minute}`);
      scheduleDay.checkinRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.start.hour}:${this.schedule[day].rest.start.minute}`);;
      scheduleDay.departureRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.end.hour}:${this.schedule[day].rest.end.minute}`);;
    }
    const navigationExtras: NavigationExtras = {
      state: { day, scheduleDay, timetableId, isCommerce: true, isWizard: true, routeBack: 'tabs/wizard/timetable' },
      relativeTo: this.activatedRoute
    };
    this.navCtrl.navigateForward(['select-hour'], navigationExtras);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
