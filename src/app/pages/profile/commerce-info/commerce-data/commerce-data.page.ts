/* eslint-disable max-len */
import { TimeTableService } from 'src/app/core/services/timeTable/time-table.service';
import { TimeTableTransformer } from 'src/app/core/transformers/timeTable.transformer';
import { ScheduleDay } from 'src/app/core/interfaces/schedule-day.interface';
import { DateService } from 'src/app/core/utils/date.service';
import { ActionSheetController, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { CommerceService } from './../../../../core/services/commerce/commerce.service';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { TimeTable } from 'src/app/core/models/timeTable/timeTable.model';
import {
  IonIntlTelInputModel,
  IonIntlTelInputValidators,
} from 'ion-intl-tel-input';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import slugify from 'slugify';

@Component({
  selector: 'app-commerce-data',
  templateUrl: './commerce-data.page.html',
  styleUrls: ['./commerce-data.page.scss'],
})
export class CommerceDataPage implements OnInit, OnDestroy {
  currentUser: Employee;
  commerce: Commerce;
  commerceForm: FormGroup;
  timeTableForm: FormGroup;
  timetableText = 'Ver horario';
  weekDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  schedule: ScheduleDay;
  phone: IonIntlTelInputModel = {
    dialCode: '+34',
    internationalNumber: '',
    isoCode: 'es',
    nationalNumber: '',
  };

  formValue = { phoneNumber: this.phone };
  subscription: Subscription = new Subscription();
  constructor(
    private navCtrl: NavController,
    private commerceService: CommerceService,
    private formBuilder: FormBuilder,
    private dateService: DateService,
    private timeTableService: TimeTableService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.subscription.add(
      this.timeTableService.updateHourday$.subscribe((response) => {
        this.setDefaultHours(response);
      })
    );
  }

  get phoneNumber() {
    return this.commerceForm.get('phone');
  }

  get slug() {
    return this.commerceForm.get('slug');
  }
  get name() {
    return this.commerceForm.get('name');
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }
  ngOnInit() {}
  ionViewWillEnter() {
    this.getCommerceData();
  }
  getCommerceData() {
    this.subscription.add(
      this.commerceService
        .getCommerceInfoById(this.currentUser.commerce)
        .subscribe((response) => {
          this.commerce = response;
          this.initForms();
          this.setDefaultHours(this.commerce.timetable);
          if (this.commerce) {
            const customerPhone: IonIntlTelInputModel = {
              dialCode: '+34',
              internationalNumber: '',
              isoCode: 'es',
              nationalNumber: this.commerce?.phone,
            };
            this.phoneNumber.setValue(customerPhone);
          }
        })
    );
  }

  initForms() {
    this.initCommerceForm();
    this.initTimeTableForm();
  }

  initCommerceForm() {
    this.commerceForm = this.formBuilder.group({
      name: [this.commerce ? this.commerce.name : '', Validators.required],
      phone: [
        this.formValue.phoneNumber,
        [Validators.required, IonIntlTelInputValidators.phone],
      ],
      email: [this.commerce ? this.commerce.email : '', Validators.required],
      slug: [this.commerce ? this.commerce.slug : '', Validators.required],
      description: [this.commerce ? this.commerce.description : ''],
      address: [
        this.commerce ? this.commerce.address : '',
        Validators.required,
      ],
      province: [
        this.commerce ? this.commerce.province : '',
        Validators.required,
      ],
      city: [this.commerce ? this.commerce.city : '', Validators.required],
      municipality: [
        this.commerce ? this.commerce.municipality : '',
        Validators.required,
      ],
      postCode: [
        this.commerce ? this.commerce.postCode : '',
        [Validators.required, Validators.maxLength(5)],
      ],
      website: [this.commerce ? this.commerce.website : ''],
      facebook: [this.commerce ? this.commerce.facebook : ''],
      instagram: [this.commerce ? this.commerce.instagram : ''],
      linkedin: [this.commerce ? this.commerce.linkedin : ''],
    });
    this.slug.valueChanges
      .pipe(
        debounceTime(700), // Wait for 500ms before emitting the value
        distinctUntilChanged() // Only emit if the value has changed since the last emission
      )
      .subscribe((value) => {
        this.checkIfSlugExist(value);
      });
    this.name.valueChanges
      .pipe(
        debounceTime(700), // Wait for 500ms before emitting the value
        distinctUntilChanged() // Only emit if the value has changed since the last emission
      )
      .subscribe((value) => {
        this.checkIfNameExist(value);
      });
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
      const checkinHour = this.dateService.addZeroToMinutesAndHours(
        `${this.schedule[day].start.hour}:${this.schedule[day].start.minute}`
      );
      const departureHour = this.dateService.addZeroToMinutesAndHours(
        `${this.schedule[day].end.hour}:${this.schedule[day].end.minute}`
      );
      if (this.schedule[day].rest) {
        const checkinRestHour = this.dateService.addZeroToMinutesAndHours(
          `${this.schedule[day].rest.start.hour}:${this.schedule[day].rest.start.minute}`
        );
        const departureRestHour = this.dateService.addZeroToMinutesAndHours(
          `${this.schedule[day].rest.end.hour}:${this.schedule[day].rest.end.minute}`
        );
        this.timeTableForm
          .get(`checkinTime${day}`)
          .setValue(
            `${checkinHour}-${checkinRestHour} | ${departureRestHour}-${departureHour}`
          );
        this.timeTableForm.get(`departureTime${day}`).setValue('');
      } else {
        this.timeTableForm.get(`checkinTime${day}`).setValue(`${checkinHour}-`);
        this.timeTableForm.get(`departureTime${day}`).setValue(departureHour);
      }
      this.timeTableForm
        .get(day)
        .setValue(!checkinHour.includes('null') ? true : false);
    }
    this.schedule.uuid = timetable.uuid;
  }

  onFocus(event) {
    event.target.parentElement.classList.add('fill-input');
  }

  onBlur(event) {
    if (!event.target.value) {
      event.target.parentElement.classList.remove('fill-input');
    }
  }

  checkIfSlugExist(value: string) {
    const val =
      value.length > 0 ? slugify(value, { lower: true, trim: true }) : '';
    if (val.length > 0) {
      this.commerceService
        .checkIfSlugExist(val)
        .subscribe((res: Commerce[]) => {
          if (res.length > 0 && res[0].uuid !== this.commerce.uuid) {
            this.slug.setErrors({ duplicated: true });
            this.cd.detectChanges();
          }
        });
    } else {
      this.slug.setErrors({ required: true });
    }
  }

  checkIfNameExist(value: string) {
    if (value.length > 0) {
      this.commerceService
        .checkIfNameExist(value.toLowerCase().trim())
        .subscribe((res: Commerce[]) => {
          if (res.length > 0 && res[0].uuid !== this.commerce.uuid) {
            this.name.setErrors({ duplicated: true });
            this.cd.detectChanges();
          }
        });
    } else {
      this.name.setErrors({ required: true });
    }
  }

  saveCommerce() {
    if (this.commerceForm.valid) {
      const newData: Commerce = new Commerce();
      newData.uuid = this.commerce.uuid;
      newData.name = this.commerceForm.get('name').value;
      newData.phone = this.phoneNumber.value.internationalNumber.replace(
        /\s/g,
        ''
      );
      newData.description = this.commerceForm.get('description').value;
      newData.address = this.commerceForm.get('address').value;
      newData.province = this.commerceForm.get('province').value;
      newData.municipality = this.commerceForm.get('municipality').value;
      newData.city = this.commerceForm.get('city').value;
      newData.postCode = this.commerceForm.get('postCode').value;
      if (this.commerceForm.get('website').value !== '') {
        newData.website = this.commerceForm.get('website').value;
      }
      if (this.commerceForm.get('facebook').value !== '') {
        newData.facebook = this.commerceForm.get('facebook').value;
      }
      if (this.commerceForm.get('instagram').value !== '') {
        newData.instagram = this.commerceForm.get('instagram').value;
      }
      if (this.commerceForm.get('linkedin').value !== '') {
        newData.linkedin = this.commerceForm.get('linkedin').value;
      }

      newData.slug = slugify(this.slug.value, { lower: true, trim: true });

      this.subscription.add(
        this.commerceService.saveCommerce(newData).subscribe((response) => {
          if (response) {
            localStorage.setItem('currentCommerce', JSON.stringify(response));
            this.cancel();
          }
        })
      );
    }
  }

  cancel() {
    this.navCtrl.navigateBack(['tabs/profile/commerce-info'], {
      replaceUrl: true,
    });
  }

  goToConfigureSchedule(day: string) {
    const timetableId = this.schedule.uuid;
    const scheduleDay = {
      checkinHour: this.timeTableForm.get(`checkinTime${day}`).value,
      departureHour: this.timeTableForm.get(`departureTime${day}`).value,
      checkinRestHour: '',
      departureRestHour: '',
    };
    if (this.schedule[day].rest) {
      scheduleDay.checkinHour = this.dateService.addZeroToMinutesAndHours(
        `${this.schedule[day].start.hour}:${this.schedule[day].start.minute}`
      );
      scheduleDay.departureHour = this.dateService.addZeroToMinutesAndHours(
        `${this.schedule[day].end.hour}:${this.schedule[day].end.minute}`
      );
      scheduleDay.checkinRestHour = this.dateService.addZeroToMinutesAndHours(
        `${this.schedule[day].rest.start.hour}:${this.schedule[day].rest.start.minute}`
      );
      scheduleDay.departureRestHour = this.dateService.addZeroToMinutesAndHours(
        `${this.schedule[day].rest.end.hour}:${this.schedule[day].rest.end.minute}`
      );
    }
    const navigationExtras: NavigationExtras = {
      state: { day, scheduleDay, timetableId, isCommerce: true },
      relativeTo: this.activatedRoute,
    };
    this.navCtrl.navigateForward(['select-hour'], navigationExtras);
  }

  changeAccordion(event) {
    this.timetableText = event.detail.value ? 'Ocultar horario' : 'Ver horario';
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
