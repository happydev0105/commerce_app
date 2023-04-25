import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Customer } from './../../../core/models/customer/customer.model';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { IonIntlTelInputModel, IonIntlTelInputValidators } from 'ion-intl-tel-input';
import { BookingService } from 'src/app/core/services/booking/booking.service';
import { Booking } from 'src/app/core/models/reservation.model';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { isFuture, isPast } from 'date-fns';
import { PaymentsService } from 'src/app/core/services/payments/payments.service';
import { IPayment } from 'src/app/core/interfaces/payment.interface';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { BookingTransformer } from 'src/app/core/transformers/booking.transformer';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.page.html',
  styleUrls: ['./customer-detail.page.scss'],
  providers: [EmailComposer]
})
export class CustomerDetailPage implements OnInit, OnDestroy {

  @ViewChild(AlertComponent) deleteAlert: AlertComponent;

  customer: Customer;
  customerForm: FormGroup;
  isEdit = false;
  title = 'Crear cliente';
  defaultImage = '/assets/no-image.jpeg';
  commerceLogged: Commerce;
  isNewBooking: boolean;
  isNewPayment: boolean;
  customerBookings: Booking[] = [];
  customerBookingsPast: Booking[] = [];
  segmentCollection: string[];
  segment: string;
  segmentBookCollection: string[];
  customerPayments: IPayment[] = [];
  totalAmounts = [];
  customerId: string;
  segmentBook: string;
  totalBooking = 0;
  totalNonAttended = 0;
  totalCanceled = 0;
  phone: IonIntlTelInputModel = {
    dialCode: '+34',
    internationalNumber: '',
    isoCode: 'es',
    nationalNumber: ''
  };
  formValue = { phoneNumber: this.phone };
  subscription: Subscription = new Subscription();
  totalPayedBookings: string;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private utilsService: UtilsService,
    private emailComposer: EmailComposer,
    private activatedRoute: ActivatedRoute,
    private paymentsService: PaymentsService,
    private navCtrl: NavController,
    private bookingService: BookingService,
    private callNumber: CallNumber,
  ) {

    this.segmentCollection = ['Citas', 'Pagos',];
    this.segment = this.segmentCollection[0];
    this.segmentBookCollection = ['Proximas', 'Pasadas',];
    this.segmentBook = this.segmentBookCollection[0];
    this.commerceLogged = JSON.parse(localStorage.getItem('currentCommerce'));
    this.initForms();
    if (this.router.getCurrentNavigation().extras.state) {

      if (this.router.getCurrentNavigation().extras.state.isNewPayment) {
        this.isNewPayment = this.router.getCurrentNavigation().extras.state.isNewPayment;
        this.title = 'Crear cliente';
      }
      if (this.router.getCurrentNavigation().extras.state.isNewBooking) {
        this.isNewBooking = this.router.getCurrentNavigation().extras.state.isNewBooking;
        this.title = 'Crear cliente';
      }
    } else {
      this.title = 'Crear cliente';
    }
  }

  get phoneNumber() { return this.customerForm.get('phone'); }


  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getParam();
  }

  getParam() {
    if (this.activatedRoute.snapshot.params.id) {
      this.title = 'Ficha de cliente';
      this.subscription.add(this.activatedRoute.params.subscribe((res: Params) => {
        this.customerId = res.id;
        this.getCustomerDataById(this.customerId);
      }));
    }
  }

  getCustomerDataById(id: string) {
    this.subscription.add(this.customerService.getCustomerById(id).subscribe((res: Customer) => {
      this.customer = res;
      this.isEdit = true;
      this.setCustomerValue();
      this.getCustomerBookings(this.commerceLogged.uuid, this.customer.uuid);
      this.getCustomerPayments(this.commerceLogged.uuid, this.customer.uuid);
      this.getDeletedBookingsCounter(this.commerceLogged.uuid, this.customer.uuid);
      this.getNonAttendedBookingsCounter(this.commerceLogged.uuid, this.customer.uuid);
    }));
  }

  initForms() {
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [this.formValue.phoneNumber,
      [Validators.required,
      IonIntlTelInputValidators.phone]
      ],
      photo: [''],
    });
  }

  setCustomerValue() {
    const customerPhone: IonIntlTelInputModel = {
      dialCode: '+34',
      internationalNumber: '',
      isoCode: 'es',
      nationalNumber: this.customer.phone
    };
    this.phoneNumber.setValue(customerPhone);
    this.customerForm.get('name').setValue(this.customer.name);
    this.customerForm.get('lastname').setValue(this.customer.lastname);
    this.customerForm.get('email').setValue(this.customer.email);
    this.customerForm.get('photo').setValue(this.customer.photoURL);
  }


  saveCustomer() {
    const customer: Customer = this.createCustomerModel();
    if (this.isEdit) {
      this.subscription.add(this.customerService.updateCustomer(customer).subscribe((response) => {
        if (response) {
          this.cancel();
        }
      }));
    } else {
      this.subscription.add(this.customerService.saveCustomer(customer).subscribe((response) => {
        if (response) {
          this.cancel(response);
        }
      }));
    }
  }

  sendEmail() {
    this.emailComposer.requestPermission();
    this.emailComposer.getClients().then((apps: []) => {
      // Returns an array of configured email clients for the device
      console.log(apps);

    });

    /* this.emailComposer.hasClient().then(app, (isValid: boolean) => {
     if (isValid) {
       // Now we know we have a valid email client configured
       // Not specifying an app will return true if at least one email client is configured
     }
    });

    this.emailComposer.hasAccount().then((isValid: boolean) => {
     if (isValid) {
       // Now we know we have a valid email account configured
     }
    });

    this.emailComposer.isAvailable().then(app, (available: boolean) => {
     if(available) {
       // Now we know we can send an email, calls hasClient and hasAccount
       // Not specifying an app will return true if at least one email client is configured
     }
    }); */

    const email = {
      to: this.customer.email,
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }

  getCustomerPayments(commerceId: string, customerId: string) {
    this.totalAmounts = [];
    this.subscription.add(this.paymentsService.getPaymentByCommerceCustomer(commerceId, customerId).subscribe((response: IPayment[]) => {
      this.customerPayments = response;
      this.totalPayedBookings =
        this.customerPayments.reduce((sum, payment) => (payment.amount + (payment.decimals / 100)) + sum, 0).toFixed(2);
    }));
  }
  getNonAttendedBookingsCounter(commerceId: string, customerId: string) {
    this.subscription.add(
      this.bookingService.findNonAttendedBookingByCommerceAndCustomer(commerceId, customerId).subscribe((res: number) => {
        this.totalNonAttended = res;
      }));
  }
  getDeletedBookingsCounter(commerceId: string, customerId: string) {
    this.subscription.add(this.bookingService.findDeletedBookingByCommerceAndCustomer(commerceId, customerId).subscribe((res: number) => {
      this.totalCanceled = res;
    }));
  }

  createCustomerModel(): Customer {
    const customer = new Customer();
    if (this.isEdit) { customer.uuid = this.customer.uuid; }
    customer.name = this.customerForm.get('name').value;
    customer.lastname = this.customerForm.get('lastname').value;
    customer.email = this.customerForm.get('email').value;
    customer.phone = this.customerForm.get('phone').value.internationalNumber.replace(/\s/g, '');
    customer.password = this.utilsService.generateRandomPassword();
    customer.photoURL = this.customerForm.get('photo').value;
    customer.commerce = this.commerceLogged.uuid;
    customer.createdBy = this.commerceLogged.uuid;
    customer.createdByCommerce = true;
    return customer;
  }

  async sendSms() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activatedRoute,
      queryParams: {
        isFromCustomer: true,
        phone: JSON.stringify(this.customer.phone),
      }
    };
    this.navCtrl.navigateRoot(['sms'], navigationExtras);
  }




  getCustomerBookings(commerceUuid: string, customerUuid: string) {
    this.subscription.add(this.bookingService.findBookingsByCommerceAndCustomer(commerceUuid, customerUuid)
      .subscribe((bookings) => {
        const books = BookingTransformer.from(bookings);
        this.totalBooking = bookings.length;
        this.customerBookings = [...books.filter((bookingsItems: Booking) => {
          if (bookingsItems.status !== 'Realizada') {
            const date = new Date(
              Number(bookingsItems.startsDay.split('-')[0]),
              Number(bookingsItems.startsDay.split('-')[1]) - 1,
              Number(bookingsItems.startsDay.split('-')[2]),
              bookingsItems.startsHour,
              bookingsItems.startsMinute);
            return isFuture(date);
          }

        })];
        this.customerBookingsPast = [...books.filter((bookingsItems: Booking) => {
          const date = new Date(Number(bookingsItems.startsDay.split('-')[0]),
            Number(bookingsItems.startsDay.split('-')[1]) - 1,
            Number(bookingsItems.startsDay.split('-')[2]),
            bookingsItems.startsHour,
            bookingsItems.startsHour,
            bookingsItems.startsMinute);
          return isPast(date);
        })];

      }));
  }
  goToBookingDetail(booking: Booking) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activatedRoute,
      state: { booking, isFromCustomerPage: true }
    };
    this.navCtrl.navigateForward([`booking/${booking.uuid}`], navigationExtras);
  }

  onFocus(event) {
    event.target.parentElement.classList.add('fill-input');
  }

  onBlur(event) {
    // Si tiene contenido el input no se la quitamos
    if (!event.target.value) {
      event.target.parentElement.classList.remove('fill-input');
    }
  }

  goToDetail(payment: IPayment) {
    if (payment.booking) {
      this.navCtrl.navigateForward([`booking/${payment.booking.uuid}`], { state: { fromBilling: true } });
    } else {
      this.navCtrl.navigateForward([`payment-detail/${payment.uuid}`],);
    }
  }


  callCommerce(): void {

    this.callNumber.callNumber(this.customer.phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  cancel(customer?: Customer) {
    if (this.isNewBooking) {
      const navExtra: NavigationExtras = {
        queryParams: { newCustomer: JSON.stringify(customer) },
        state: { newCustomer: customer },
      };

      this.navCtrl.navigateBack('tabs/home/new-booking', navExtra);

    } else if (this.isNewPayment) {
      const navExtra: NavigationExtras = {
        queryParams: { newCustomer: JSON.stringify(customer) },
        state: { newCustomer: customer },
      };

      this.navCtrl.navigateBack('tabs/payments', navExtra);
    } else {
      this.navCtrl.back();

    }
  }

  viewNotes() {
    this.navCtrl.navigateForward([`customer-notes/${this.customer.uuid}`], { relativeTo: this.activatedRoute });
  }
  editCustomer() {
    const navigationExtras: NavigationExtras = {
      state: { customer: this.customer },
      relativeTo: this.activatedRoute
    };
    this.navCtrl.navigateForward(['edit-customer'], navigationExtras);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
