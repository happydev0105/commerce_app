import { switchMap } from 'rxjs/operators';
import { AlertController, isPlatform, NavController } from '@ionic/angular';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  NavigationExtras,
  Params,
  Router,
} from '@angular/router';
import { addMinutes } from 'date-fns';
import { isPast } from 'date-fns/esm';
import { Customer } from 'src/app/core/models/customer/customer.model';
import { PaymentDto } from 'src/app/core/models/payments/payments.model';
import { Booking } from 'src/app/core/models/reservation.model';
import { Service } from 'src/app/core/models/service.model';
import { BookingService } from 'src/app/core/services/booking/booking.service';
import { DateService } from 'src/app/core/utils/date.service';
import { AlertNonAttendedComponent } from 'src/app/shared/components/alert-non-attended/alert-non-attended.component';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { PaymentsService } from 'src/app/core/services/payments/payments.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.page.html',
  styleUrls: ['./booking-item.page.scss'],
})
export class BookingItemPage implements OnInit, OnDestroy {
  @ViewChild(AlertComponent) deleteAlert: AlertComponent;
  @ViewChild(AlertNonAttendedComponent) nonAttended: AlertNonAttendedComponent;
  bookingId: string;
  bookingData: Booking;
  totalPrice = 0;
  isPayed = false;
  isPast: boolean;
  fromBillingPage = false;
  isFromCustomerPage = false;
  subscription: Subscription = new Subscription();
  isIOS = false;
  constructor(
    private bookingService: BookingService,
    private activateRoute: ActivatedRoute,
    public dateService: DateService,
    private router: Router,
    private navCtrl: NavController,
    private paymentsService: PaymentsService,
    private toastService: ToastService,
    private alertCtrl: AlertController
  ) {
    this.isIOS = isPlatform('android') ? false : true;
    if (this.router.getCurrentNavigation().extras.state) {
      if (this.router.getCurrentNavigation().extras.state.isFromCustomerPage) {
        this.isFromCustomerPage = true;
      }
      this.fromBillingPage = this.router.getCurrentNavigation().extras.state.fromBilling;
    }
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getIdParam();
  }

  checkIsPast(res: Booking) {
    const dateSplit = res.startsDay.split('-');
    const date = addMinutes(new Date(
      parseInt(dateSplit[0], 10),
      parseInt(dateSplit[1], 10) - 1,
      parseInt(dateSplit[2], 10),
      res.startsHour,
      res.startsMinute,
    ), res.duration);
    this.isPast = isPast(date);
  }

  getIdParam() {
    this.subscription.add(this.activateRoute.params.subscribe((param: Params) => {
      this.bookingId = param.id;
      this.getBookingById(this.bookingId);
    }));
  }
  getBookingById(bookingId: string): void {
    this.subscription.add(this.bookingService.findBookingById(bookingId).subscribe((res: Booking) => {
      if (res) {
        this.bookingData = res;
        this.checkIsPast(res);

        if (this.bookingData.status === 'Realizada' && this.bookingData.paymentSettedUuid && !this.bookingData.payment) {
          this.subscription.add(this.paymentsService.getPaymentById(this.bookingData.paymentSettedUuid).subscribe(payment => {
            if (payment) {
              this.bookingData.payment = payment;
              this.calcTotalPriceService(this.bookingData.payment.service);
            } else {
              this.bookingData.paymentSettedUuid = '';
              this.bookingData.status = 'Pendiente de pago';
              this.calcTotalPriceService(this.bookingData.service);
            }
            this.subscription.add(this.bookingService.updateBooking(this.bookingData).subscribe((result: Booking) => {

              this.bookingData = result;
              if (this.bookingData.payment || this.bookingData.paymentSettedUuid) {
                this.isPayed = true;
              }
              if (this.bookingData.payment) {
                this.totalPrice = this.bookingData.payment ? (this.bookingData.payment.amount + (this.bookingData.payment.decimals / 100)) :
                  this.calcTotalPriceService(this.bookingData.payment.service);

              } else {
                this.totalPrice = this.bookingData.payment ? (this.bookingData.payment.amount + (this.bookingData.payment.decimals / 100)) :
                  this.calcTotalPriceService(this.bookingData.service);

              }
            }));
          }));
        }
        if (this.bookingData.payment || this.bookingData.paymentSettedUuid) {
          this.isPayed = true;
        }
        if (this.bookingData.payment) {
          this.totalPrice = this.bookingData.payment ? (this.bookingData.payment.amount + (this.bookingData.payment.decimals / 100)) :
            this.calcTotalPriceService(this.bookingData.payment.service);

        } else {
          this.totalPrice = this.bookingData.payment ? (this.bookingData.payment.amount + (this.bookingData.payment.decimals / 100)) :
            this.calcTotalPriceService(this.bookingData.service);

        }
      }
    }));
  }
  goToDetail(customerSelected: Customer) {
    const navigationExtras: NavigationExtras = {
      state: { customer: customerSelected },
      relativeTo: this.activateRoute
    };
    this.navCtrl.navigateForward([`customer-detail/${customerSelected.uuid}`], navigationExtras);
  }
  editBooking() {
    this.navCtrl.navigateForward([`booking-edit/${this.bookingId}`], { relativeTo: this.activateRoute });
  }
  calcTotalPriceService(service: Service[]): number {
    let price = 0;
    service.forEach((item: Service) => {
      price = price + item.price;
    });

    this.totalPrice = price;
    return this.totalPrice;
  }
  openAlert() {
    this.deleteAlert.presentAlertConfirm();
  }
  openAlertNonAttendant() {
    this.nonAttended.presentAlertConfirm();
  }
  cancel() {
    if (this.fromBillingPage) {
      this.navCtrl.navigateBack('tabs/profile/billing');
    } else if (this.isFromCustomerPage) {
      this.navCtrl.back();
    } else {
      this.navCtrl.navigateForward('tabs/home');
    }
  }
  alertBox(value: boolean) {
    if (value) {
      this.deleteItem();
    }
  }
  alertBoxNonAttended(value) {
    if (value) {
      this.setAsNonAttended();
    }
  }

  setAsNonAttended() {
    this.bookingData.status = 'No asistida';
    this.subscription.add(this.bookingService.saveBooking(this.bookingData).subscribe(res => {
    }));
  }
  payBooking() {
    const newPayment: PaymentDto = new PaymentDto();
    if (this.totalPrice.toString().includes('.')) {
      newPayment.amount = parseInt(
        this.totalPrice.toString().split('.')[0],
        10
      );
      newPayment.decimals = parseInt(
        this.totalPrice.toFixed(2).split('.')[1],
        10
      );
    } else {
      newPayment.amount = this.totalPrice;
      newPayment.decimals = 0;
    }

    newPayment.service = this.bookingData.service;
    newPayment.date = this.dateService.formatDate(new Date());
    newPayment.discount = 0;
    newPayment.commerce = this.bookingData.commerce;
    newPayment.booking = this.bookingData;
    newPayment.customer = this.bookingData.customer;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activateRoute,
      queryParams: {
        payment: JSON.stringify(newPayment),
        hideWalkinClient: JSON.stringify(true)
      }
    };
    this.navCtrl.navigateForward(['payments'], navigationExtras);
  }
  deleteItem() {
    if (!this.isPayed) {
      this.subscription.add(this.bookingService
        .deleteBookingById(this.bookingId)
        .subscribe((res: any) => {
          if (res) {
            this.cancel();
          }
        }));
    }
  }

  async deletePayment() {
    let paymentId;
    if (this.bookingData.payment) {
      paymentId = this.bookingData.payment.uuid;
    } else {
      paymentId = this.bookingData.paymentSettedUuid;
    }
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: '¿Desea eliminar el cobro de esta reserva?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: () => { },
        },
        {
          text: 'Aceptar',
          id: 'confirm-button',
          handler: () => {
            this.subscription.add(this.paymentsService.deletePayment(paymentId)
              .subscribe((response: any) => {
                if (response) {
                  this.toastService.presentToast('Cobro eliminado correctamente', true);
                  this.bookingData.status = 'Pendiente de pago';
                  this.bookingData.payment = null;
                  this.bookingData.paymentSettedUuid = '';
                  this.bookingService.updateBooking(this.bookingData).subscribe(res => {
                    console.log(res);
                    this.bookingData = res;
                    this.isPayed = false;
                    this.calcTotalPriceService(res.service);
                  });
                }
              }));
          },
        },
      ],
    });
    await alert.present();
  }

  editPayment() {
    const payment = this.bookingData.payment;
    payment.customer = this.bookingData.customer;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activateRoute,
      queryParams: {
        payment: JSON.stringify(payment),
        hideWalkinClient: JSON.stringify(true)
      }
    };
    this.navCtrl.navigateForward(['payments'], navigationExtras);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
