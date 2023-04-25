/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-len */
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {
  AlertController,
  IonDatetime,
  IonModal,
  IonRouterOutlet,
  ModalController,
  NavController,
  PickerColumn,
  PickerColumnOption,
  PickerController,
} from '@ionic/angular';
import {
  format,
  parseISO,
  getHours,
  getMinutes,
  formatISO,
  addMinutes,
  add,
  getWeek,
  getDay,
  isWithinInterval,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { BookingDto } from 'src/app/core/dto/booking.dto';
import { IBooking } from 'src/app/core/interfaces/booking.interface';
import { Longpress } from 'src/app/core/interfaces/longpress.interface';
import { IService } from 'src/app/core/interfaces/services.interface';
import { Customer } from 'src/app/core/models/customer/customer.model';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { Booking } from 'src/app/core/models/reservation.model';
import { Service } from 'src/app/core/models/service.model';
import { BookingService } from 'src/app/core/services/booking/booking.service';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
import { NonAvailabilityService } from 'src/app/core/services/non-availability/non-availability.service';
import { ServicesService } from 'src/app/core/services/services/services.service';
import { DateService } from 'src/app/core/utils/date.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { CustomerListComponent } from 'src/app/shared/components/customer-list/customer-list.component';
import { ServiceListComponent } from 'src/app/shared/components/service-list/service-list.component';
import { intersectionBy } from 'lodash';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import SwiperCore, { EffectCoverflow, Pagination } from 'swiper';
import { TimeTable } from '../../../core/models/timeTable/timeTable.model';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { EDays } from 'src/app/core/enums/days.enum';
import { ScheduleDay } from 'src/app/core/interfaces/schedule-day.interface';
import { IRangeTimeTable } from 'src/app/core/interfaces/rangeTimetable.interface';
import { SmsDto } from 'src/app/core/dto/sms.dto';
import { CommerceService } from 'src/app/core/services/commerce/commerce.service';

SwiperCore.use([EffectCoverflow, Pagination]);

@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.page.html',
  styleUrls: ['./new-booking.page.scss'],
})
export class NewBookingPage implements OnInit, OnDestroy {
  @ViewChild(IonDatetime) datetime: IonDatetime;
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild(IonDatetime) time: IonDatetime;
  @ViewChild(AlertComponent) deleteAlert: AlertComponent;
  subscriptionCollection: Subscription;
  form: FormGroup;
  showPickerDate = false;
  employeeCollection: Employee[] = [];
  employeeCollectionOriginal: Employee[] = [];
  serviceCollection: IService[] | Service[] = [];
  serviceCollectionOriginal: IService[] | Service[] = [];
  latestServiceCollection: Service[] = [];
  serviceSelected: Service[] = [];
  customerSelected: Customer;
  dateValue: string;
  timeValue: string;
  startDate: Date = new Date();
  isEdit = false;
  editItem: IBooking;
  title: string;
  id: string;
  commerceLogged: string;
  durationBookingExtra =0;
  totalPrice = '0 €';
  bookingData: Longpress;
  stringHour: string;
  locale = es;
  actualDate = new Date();
  duration = 0;
  selectedDay: string;
  isAvailable = true;
  isWalkinClient = false;
  walkinClient: Customer;
  hourCollection: string[] = [];
  minuteCollection: string[] = [];
  hourStartSelected = '00';
  minuteStartSelected = '00';
  hourEndSelected = '';
  minuteEndSelected = '';
  commercerTimetable: TimeTable;
  currentUser: Employee;
  subscription: Subscription = new Subscription();
  commerce: Commerce;
  pickerColumns: PickerColumn[];
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    public dateService: DateService,
    private nonAvailabilityService: NonAvailabilityService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private serviceService: ServicesService,
    private pickerCtrl: PickerController,
    private commerceService: CommerceService,
    private bookingService: BookingService,
    private router: Router,
    private navCtrl: NavController,
    private customerService: CustomerService,
    private alertController: AlertController,
    private utilsService: UtilsService
  ) {
    this.hourCollection = this.utilsService.generateHours(0, 24);
    this.minuteCollection = this.utilsService.generateMinutes();
    this.commerceLogged = JSON.parse(
      localStorage.getItem('currentUser')
    ).commerce;

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.initForm();
    if (this.router.getCurrentNavigation().extras.state) {
      if (this.router.getCurrentNavigation().extras.state.bookingData) {
        this.bookingData =
          this.router.getCurrentNavigation().extras.state.bookingData;
        this.stringHour =
          this.bookingData.selectedHour.hours +
          ':' +
          this.bookingData.selectedHour.minutes;
          this.pickerColumns = this.generateHoursColum();
        /*   this.checkAvailability(); */
      }
      if (this.router.getCurrentNavigation().extras.state.newCustomer) {
        this.customerSelected =
          this.router.getCurrentNavigation().extras.state.newCustomer;
      }
      this.selectedDay =
        this.router.getCurrentNavigation().extras.state.selectedDay;


    }


    this.getWalkinCustomer();
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
  get customer() {
    return this.form.get('customer');
  }
  get note() {
    return this.form.get('note');
  }
  get service() {
    return this.form.get('service');
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ionViewWillEnter() {
    if (this.activatedRoute.snapshot.queryParams.newCustomer) {
      this.customerSelected = JSON.parse(
        this.activatedRoute.snapshot.queryParams.newCustomer
      );
    }
    this.concatRequiredRequest(this.commerceLogged);
    this.pickerColumns = this.generateHoursColum();
  }

  ngOnInit() {
  
  }

  getParam() {
    if (this.activatedRoute.snapshot.params.id) {
      this.title = 'Editar reserva';
      this.subscription.add(this.activatedRoute.params.subscribe((res: Params) => {
        this.id = res.id;

        this.findBookingByID(this.id);
        this.isEdit = true;
      }));
    } else {
      this.title = 'Crear reserva';
      this.serviceSelected = [];
      this.initForm();
      this.calcMaxEndHour();
    }
  }


  getWalkinCustomer() {
    this.subscription.add(this.customerService
      .getWalkinCustomer()
      .subscribe((res) => (this.walkinClient = res)));
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CustomerListComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        isNewBooking: true,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.customer !== undefined) {
      this.customerSelected = data.customer;
      this.customer.setValue(
        `${this.customerSelected.name} ${this.customerSelected.lastname}`
      );
      this.checkLastService(this.commerceLogged, this.customerSelected.uuid);
      this.checkAvailability();
    }
  }

  checkLastService(commerce: string, customer: string) {
    this.latestServiceCollection = [];
    this.subscription.add(this.bookingService
      .findLastBookingByCommerceAndCustomer(commerce, customer)
      .subscribe((res: Booking) => {
        if (res) {
          const findEmployee = this.employeeCollection.find(
            (employee) => employee.uuid === this.employee.value
          );
          if (findEmployee) {
            const lastService = res.service.filter((service) =>
              findEmployee.services.some((item) => item.uuid === service.uuid)
            );
            this.latestServiceCollection = [...lastService];
          }
        }
      }));
  }

  addLatestService() {
    this.serviceSelected = [...this.latestServiceCollection];
    this.calcTotalPriceService(this.serviceSelected);
    this.discount();
    this.calculateEndHour();
    this.checkAvailability();
  }

  concatRequiredRequest(commerce: string): void {
    forkJoin([
      this.findEmployeeCollection(commerce),
      this.findServiceCollection(commerce),
      this.findCommerceData(commerce)
    ]).subscribe((res: [Employee[], IService[], Commerce]) => {
      this.serviceCollection = res[1];
      this.commerce = res[2];
      this.serviceCollectionOriginal = res[1];
      if (!this.isEdit) {
        let weekDay: string;
        if (this.selectedDay) {
          weekDay = EDays[getDay(new Date(this.selectedDay))];
        } else {
          weekDay = EDays[getDay(new Date())];
        }


        this.employeeCollection = res[0].filter(
          (employee: Employee) => employee.services && employee.services.length > 0 && employee.isEmployee && employee.isActive && JSON.parse(employee?.timetable[weekDay]).start.hour !== null
        ).sort((a: Employee, b: Employee) =>
        a.order < b.order ? -1 : 1
      );
      }


      this.employeeCollectionOriginal = [...this.employeeCollection];
      if (this.bookingData) {
        this.selectedEmployee(this.bookingData.employee.uuid);
      }
      this.getParam();
    });

  }
  findBookingByID(bookingID: string) {
    this.subscription.add(this.bookingService
      .findBookingById(bookingID)
      .subscribe((res: BookingDto) => {
        const dateSplit = res.startsDay.split('-');
        this.durationBookingExtra = res.duration - this.calcTotalDurationService(res.service);
        const date = new Date(
          parseInt(dateSplit[0], 10),
          parseInt(dateSplit[1], 10) - 1,
          parseInt(dateSplit[2], 10),
          res.startsHour,
          res.startsMinute
        );
        this.startDay.setValue(format(date, 'yyyy-MM-dd', { locale: es }));
        this.selectedDay = this.startDay.value;

        this.startHour.setValue(
          format(
            new Date(2022, 1, 1, res.startsHour, res.startsMinute),
            'HH:mm'
          )
        );
        this.customer.setValue(`${res.customer.name} ${res.customer.lastname}`);
        if (res.customer.isWalkingClient) {
          this.isWalkinClient = true;
        } else {
          this.customerSelected = res.customer;
        }
        this.selectedEmployee(res.asignedTo.uuid);
        this.service.setValue(res.service);
        this.serviceSelected = [...res.service];
        this.selectedService(res.service);
        this.message.setValue(res.message);
        this.note.setValue(res.note);
        this.endHour.setValue(format(addMinutes(date, res.duration), 'HH:mm'));
        this.bookingData = {
          selectedDay:  null,
          selectedHour: {hours: getHours(date),
            minutes: getMinutes(date)}}
        this.pickerColumns = this.generateHoursColum();
        // this.calcMaxEndHour();
      }));
  }

  findEmployeeCollection(commerce: string): Observable<Employee[]> {
    return this.employeeService.findEmployees(commerce);
  }
  findCommerceData(commerce: string): Observable<Commerce> {
    return this.commerceService.getCommerceInfoById(commerce);
  }
  findServiceCollection(commerce: string): Observable<IService[]> {
    return this.serviceService.findServiceByCommerce(commerce);
  }

  //Calc max endHour
  calcMaxEndHour(): IRangeTimeTable {
    if (!this.employee.value) {
      const commerce: Commerce = JSON.parse(
        localStorage.getItem('currentCommerce')
      );
      const commerceTimetable: ScheduleDay =
        this.utilsService.getTimetableByCommerce(commerce);
      const weekDay = EDays[getDay(new Date(this.selectedDay))];
      return commerceTimetable[weekDay];
    } else {
      const employeeTimetable: ScheduleDay =
        this.utilsService.getTimetableByEmployeeId(
          this.employee.value,
          this.employeeCollection
        );
      const weekDay = EDays[getDay(new Date(this.selectedDay))];
      /* if(!this.checkIfSelectedHourIsOutOfRange(employeeTimetable[weekDay], employeeTimetable[weekDay])){
       const hourAvailable: string = `${employeeTimetable[weekDay].start.hour}:${employeeTimetable[weekDay].start.minute}`
       this.setSelectedStartHour(hourAvailable)
       this.toast.presentToast('La hora de inicio se ha cambiado por el horario del empleado seleccionado', true)
      } */
      return employeeTimetable[weekDay];
    }
  }

  checkIfSelectedHourIsOutOfRange(
    start: IRangeTimeTable,
    end: IRangeTimeTable
  ): boolean {
    const startDate: Date = new Date(
      2022,
      0,
      1,
      start.start.hour,
      start.start.minute
    );
    const endDate: Date = new Date(2022, 0, 1, end.end.hour, end.end.minute);
    const selectedDate: Date = new Date(
      2022,
      0,
      1,
      this.startHour.value.split(':')[0],
      this.startHour.value.split(':')[1]
    );

    return isWithinInterval(selectedDate, { start: startDate, end: endDate });
  }

  dateChanged(value: string) {
    this.startDate = new Date(value);
    this.dateValue = format(parseISO(value), 'd MMM, yyyy');
    this.checkAvailability();
  this.modal.dismiss();
  }
  timeChanged(value) {
    this.timeValue = format(parseISO(value), 'HH:mm ');
    this.checkAvailability();
  }
  dismiss() {
    this.datetime.cancel(true);
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
  onChangeStartHour(event) {
    if (event !== undefined) {
      const hourSelected: string = event;
      if (hourSelected?.length > 0) {
        this.startHour.setValue(
          hourSelected.split(':')[0] + ':' + hourSelected.split(':')[1]
        );
        if (this.bookingData) {
          this.bookingData.selectedHour.hours = Number.parseInt(
            hourSelected.split(':')[0],
            10
          );
          this.bookingData.selectedHour.minutes = Number.parseInt(
            hourSelected.split(':')[1],
            10
          );
        }
        if (this.serviceSelected.length > 0) {
          const newDate = addMinutes(
            new Date(
              2022,
              1,
              1,
              parseInt(hourSelected.split(':')[0], 10),
              parseInt(hourSelected.split(':')[1], 10)
            ),
            this.calcTotalDurationService(this.serviceSelected)
          );
          const endHour = getHours(newDate) + ':' + getMinutes(newDate);
          this.endHour.setValue(endHour);
        }
      }
    }
    this.checkAvailability();
  }
  onChangeEndHour(event) {
    if (event.detail.value.includes('T') || event.detail.value.includes('Z')) {
      event.detail.value = format(new Date(event.detail.value), 'HH:mm');
    }
    this.endHour.setValue(event.detail.value);
    this.calculateTimeBetweenEndAndStart();
    this.checkAvailability();
  }

  calcTotalPriceService(service: Service[]): number {
    let price = 0;
    service.forEach((item: Service) => {
      price = price + item.price;
    });
    return price;
  }

  calcTotalDurationService(service: IService[] | Service[]): number {
    let duration = 0;
    service.forEach((item: IService) => {
      duration = duration + item.defaultDuration;
    });
    return duration;
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
    const requestCalls = [];
    let tempEndHour = new Date();
    this.serviceSelected.forEach((service, index) => {
      const newBooking: BookingDto = new BookingDto();
      newBooking.commerce = this.commerceLogged;
      newBooking.commerceSettedUuid = this.commerceLogged;
      if (this.isWalkinClient) {
        newBooking.customer = this.walkinClient;
      } else {
        delete this.customerSelected.booking;
        newBooking.customer = this.customerSelected;
      }
      newBooking.service = [service];
      newBooking.asignedTo = this.employee.value;
    
      newBooking.week = getWeek(new Date(this.startDay.value), {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      });
      newBooking.startsDay = this.dateService.formatDate(
        new Date(this.startDay.value)
      );
      newBooking.message = this.message.value;
      newBooking.note = this.note.value;
      newBooking.paymentSettedUuid = '';
      newBooking.createdBy = `${this.currentUser.name} ${this.currentUser.surname}`;
      newBooking.createdUUID = this.currentUser.uuid;
      newBooking.createdByType = 'employee';

      if (index === 0) {
          newBooking.duration =
        (this.duration > 0 ? this.duration : service.defaultDuration) + this.durationBookingExtra;
        newBooking.startsHour = this.bookingData
          ? this.bookingData.selectedHour.hours
          : parseInt(this.startHour.value.split(':')[0], 10);
        newBooking.startsMinute = this.bookingData
          ? this.bookingData.selectedHour.minutes
          : parseInt(this.startHour.value.split(':')[1], 10);
        tempEndHour = addMinutes(
          new Date(2022, 1, 1, newBooking.startsHour, newBooking.startsMinute),
     service.defaultDuration + this.durationBookingExtra
        );
      } else {
        newBooking.startsHour = getHours(tempEndHour);
        newBooking.startsMinute = getMinutes(tempEndHour);
        tempEndHour = addMinutes(
          new Date(2022, 1, 1, newBooking.startsHour, newBooking.startsMinute),
          service.defaultDuration
        );
      }
      if (this.isEdit) {
        if (index === 0) {
          newBooking.duration =
          (this.duration > 0 ? this.duration : service.defaultDuration) + this.durationBookingExtra;
          newBooking.uuid = this.id;
          requestCalls.push(this.bookingService.updateBooking(newBooking));
        } else {
          newBooking.duration = service.defaultDuration;
          newBooking.status = 'Pendiente';
          if (newBooking.customer) {
            requestCalls.push(this.bookingService.saveBooking(newBooking));
          }
        }
      } else {
        newBooking.duration = service.defaultDuration;
        newBooking.status = 'Pendiente';
        if (newBooking.customer) {
          requestCalls.push(this.bookingService.saveBooking(newBooking));
        }

      }
    });
    forkJoin(requestCalls).subscribe((responses: Booking[]) => {
      if (responses) {
        if (!responses[0].customer.isWalkingClient && this.commerce.smsSent < this.commerce.smsAvailable) {
          this.askSendSms(responses[0]);
        }


        this.cancel();
      }
    });
  }



  sendSmsForBookings(booking: Booking) {
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
    newSms.message = `Hola ${booking.customer.name}, confirmamos su cita con ${this.commerce.name} con fecha ${format(date, 'dd-MM-yyyy \'a las\' HH:mm')}`;
    this.bookingService.sendBookingNotification(newSms).subscribe((res) => console.log(res));



  }

  async askSendSms(booking: Booking) {
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
            this.sendSmsForBookings(booking);
          },
        },
      ],
    });


    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  selectedEmployee(employeeId: string) {
    this.employee.setValue(employeeId);


    if (this.customerSelected) {
      this.checkLastService(this.commerceLogged, this.customerSelected.uuid);
    }
    this.setServiceByEmployee(employeeId);
    // this.checkCanDoSelectedService();
    //    this.calcMaxEndHour();
    this.checkAvailability();
  }

  setServiceByEmployee(employeeID: string) {
    const employee = this.employeeCollection.find(
      (emp: Employee) => emp.uuid === employeeID
    );
    if (employee) {
      this.serviceCollection = intersectionBy(
        this.serviceCollectionOriginal,
        employee.services,
        'uuid'
      );
    }
  }

  checkCanDoSelectedService() {
    const findEmployee = this.employeeCollection.find(
      (employee) => employee.uuid === this.employee.value
    );
    if (findEmployee && this.serviceSelected.length > 0) {
      this.serviceSelected = intersectionBy(
        findEmployee.services,
        this.serviceSelected,
        'uuid'
      );
    }
  }

  calculateTimeBetweenEndAndStart() {
    const hourStartSplitted = this.startHour.value.split(':');
    const hourEndSplitted = this.endHour.value.split(':');
    const year = this.actualDate.getFullYear();
    const month = this.actualDate.getMonth();
    const day = this.actualDate.getDate();
    const hourStart = parseInt(hourStartSplitted[0], 10);
    const minuteStart = parseInt(hourStartSplitted[1], 10);
    const hourEnd = parseInt(hourEndSplitted[0], 10);
    const minuteEnd = parseInt(hourEndSplitted[1], 10);
    const fechaInicio = new Date(year, month, day, hourStart, minuteStart);
    const fechaFin = new Date(year, month, day, hourEnd, minuteEnd);
    if(fechaFin < fechaInicio){
      this.endHour.setErrors({invalid: true});

      
    }else{
      this.endHour.setErrors(null);

    }
    const difference = new Date(fechaFin.getTime() - fechaInicio.getTime());
    const differenceTimeInMinutes =
      (difference.getHours() - 1) * 60 + difference.getMinutes();
    this.duration = differenceTimeInMinutes;
  }

  selectedService(value: IService[] | Service[]) {
    this.calcTotalPriceService(value);
    this.checkAvailability();
  }

  dismissModal(modalId: string) {
    const modal: any = document.getElementById(modalId);
    console.log(modal);
    if (modal) {
      console.log('entra');
      
      modal.dismiss();
    }
  }

  async presentServiceModal() {
    const serviceCollectionSelected = [...this.serviceSelected];
    const modal = await this.modalController.create({
      component: ServiceListComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        servicesSelected: serviceCollectionSelected,
        showPrice: true,
        serviceCollectionFiltered: this.serviceCollection,
        serviceCollection: this.serviceCollection,
      },
    });
    await modal.present();
    await modal.onDidDismiss().then((res: any) => {
      if (res?.data?.service?.length > 0) {
        this.serviceSelected = res.data.service;
        this.setEmployeeCollectionBySelectedService(this.serviceSelected);
        this.calcTotalPriceService(this.serviceSelected);
        this.discount();
        this.calculateEndHour();
        this.checkAvailability();
      } else if (
        res?.data?.service?.length > 0 &&
        this.serviceSelected.length === 0
      ) {
        this.employeeCollection = [...this.employeeCollectionOriginal];
      }
    });
  }

  setEmployeeCollectionBySelectedService(service: Service[]) {
    const employeeCollection = [];
    this.employeeCollectionOriginal.forEach((emp: Employee) => {
      const isAvailable = intersectionBy(emp.services, service, 'uuid');
      if (isAvailable.length === service.length) {
        employeeCollection.push(emp);
      }
    });
    this.employeeCollection = [];
    this.employeeCollection = [...employeeCollection];
  }

  checkAvailability() {
    // date, hour, minute, employee, servicesDuration, serviceCollection
    let date: string;

    if (this.isEdit) {

      date = this.dateService.formatDate(new Date(this.selectedDay));

    } else {
      date = this.dateService.formatDate(
        this.bookingData
          ? this.bookingData.selectedDay.date
          : new Date(this.selectedDay)
      );
    }
    const hour = parseInt(this.startHour.value.split(':')[0], 10);
    const minute = parseInt(this.startHour.value.split(':')[1], 10);
    const employee = this.employee.value;
    const duration = this.calcTotalDurationService(this.serviceSelected);
    const services = this.serviceSelected;
    if (date && hour && employee && duration && services) {
      this.subscription.add(this.bookingService
        .getAvailabilityPerEmployee(
          date,
          hour,
          minute,
          employee,
          duration,
          services,
          this.id
        )
        .subscribe((res: boolean) => {
          this.isAvailable = res;
        }));
    }
  }

  calculateEndHour() {
    if(this.startHour.value){

      const dateSplit = this.startDay.value.split('-');
      const hourSplit = this.startHour.value.split(':');
      let date = new Date(
        parseInt(dateSplit[0], 10),
        parseInt(dateSplit[1], 10) - 1,
        parseInt(dateSplit[2], 10),
        parseInt(hourSplit[0], 10),
        parseInt(hourSplit[1], 10)
      );
 
     date = addMinutes(date, this.calcTotalDurationService(this.serviceSelected) + this.durationBookingExtra )
      const endHour = format(date,'HH:mm');
      endHour === this.startHour.value
        ? this.endHour.setValue('')
        : this.endHour.setValue(endHour);
    }
  }



  discount(): number {
    let totalprize = this.calcTotalPriceService(this.serviceSelected)
      ? this.calcTotalPriceService(this.serviceSelected)
      : 0;
    totalprize = totalprize;
    return totalprize;
  }

  ionViewWillLeave() {
    this.customerSelected = null;
    this.latestServiceCollection = null;
    this.serviceSelected = [];
  }

  ngOnDestroy(): void {
    this.customerSelected = null;
    this.subscription.unsubscribe();
  }

  getHourAndMinute(date: Date): string {
    const hour: number = getHours(date);
    const minute: number = getMinutes(date);
    return this.dateService.addZeroToMinutes(hour + ':' + minute);
  }

  setMinEndHour() {
    let hourSplitted = '';
    hourSplitted = this.startHour.value.split(':');
    const year = this.actualDate.getFullYear();
    const month = this.actualDate.getMonth();
    const day = this.actualDate.getDate();
    const hour = parseInt(hourSplitted[0], 10);
    const minute = parseInt(hourSplitted[1], 10);
    const dateFormatted = formatISO(
      add(new Date(year, month, day, hour, minute), {
        minutes: 5,
      }),
      { representation: 'time' }
    );
    return dateFormatted;
  }


  initForm() {

    this.form = this.fb.group({
      startDay: [
        this.bookingData
          ? format(this.bookingData.selectedDay.date, 'yyyy-MM-dd', {
            locale: es,
          })
          : this.selectedDay,
        Validators.required,
      ],
      startHour: [
        this.bookingData
          ? format(
            new Date(
              2022,
              1,
              1,
              this.bookingData.selectedHour.hours,
              this.bookingData.selectedHour.minutes
            ),
            'HH:mm'
          )
          : '',
        [Validators.required, Validators.minLength(2)],
      ],
      endHour: [
        this.serviceSelected.length === 0 ? '' : this.calculateEndHour(),
        Validators.required,
      ],
      service: ['', Validators.required],
      message: [''],
      note: [''],
      employee: [
        this.bookingData ? this.bookingData.employee.uuid : '',
        Validators.required,
      ],
      customer: [''],
    });
  }


  deleteService(service: Service) {
    const serviceIndex = this.serviceSelected.findIndex(
      (item) => item.uuid === service.uuid
    );
    this.serviceSelected.splice(serviceIndex, 1);
    this.serviceSelected.length === 0
      ? this.endHour.setValue('')
      : this.calculateEndHour();
    if (this.serviceSelected.length === 0) {
      this.employeeCollection = [...this.employeeCollectionOriginal];
      this.serviceCollection = [...this.serviceCollectionOriginal];
      if (this.employee.value) {
        this.selectedEmployee(this.employee.value);
      }
    } else {
      this.setEmployeeCollectionBySelectedService(this.serviceSelected);
    }
  }

  onChangeCheckbox(event) {
    this.isWalkinClient = event.detail.checked;
    this.customerSelected = null;
  }


  checkIfCustomer(): boolean {
    if (!this.customerSelected && this.isWalkinClient) {
      return true;
    } else if (this.customerSelected && !this.isWalkinClient) {
      return true;
    }
    return false;
  }
  setSelectedStartHour(hourSelected: string) {
    this.startHour.setValue(hourSelected);
    this.onChangeStartHour(hourSelected);
  }

  setSelectedEndHour(hourSelected: string) {
    this.endHour.setValue(hourSelected);
    this.calculateTimeBetweenEndAndStart();
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
            if(this.bookingData){
              this.bookingData.selectedHour.hours = value.hours.value;
              this.bookingData.selectedHour.minutes = value.minutes.value;
            }
            this.startHour.setValue(`${value.hours.value}:${value.minutes.value}`);
            this.onChangeStartHour(`${value.hours.value}:${value.minutes.value}`);
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
           
            this.endHour.setValue(`${value.hours.value}:${value.minutes.value}`);
            this.calculateTimeBetweenEndAndStart();
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
      if(this.bookingData?.selectedHour.hours.toString() === value) {
        selectedHour = index;
      }
      const newoption: PickerColumnOption = {
        text: `${value} h`,
        value,
        selected: this.bookingData?.selectedHour.hours.toString() === value ? true: false
      };
      optionsHourCollection.push(newoption);
    });
    minutesCollection.forEach((value: string, index: number) => {
      if(this.bookingData?.selectedHour.minutes.toString() === value) {
        selectedMinutes = index;
      }
      const newoption: PickerColumnOption = {
        text: `${value} min`,
        value,
        selected: this.bookingData?.selectedHour.minutes.toString() === value  ? true: false
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
