import { IPayment } from 'src/app/core/interfaces/payment.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params } from '@angular/router';
import { PaymentsService } from 'src/app/core/services/payments/payments.service';
import { AlertController, NavController } from '@ionic/angular';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Customer } from 'src/app/core/models/customer/customer.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.page.html',
  styleUrls: ['./payment-detail.page.scss'],
})
export class PaymentDetailPage implements OnInit, OnDestroy {

  paymentId: string;
  paymentData: IPayment;
  subscription: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentsService: PaymentsService,
    private alertCtrl: AlertController,
    private toastService: ToastService,
    private navCtrl: NavController,

  ) { }


  ngOnInit() {
    this.getIdParam();
  }

  getIdParam() {
    this.subscription.add(this.activatedRoute.params.subscribe((param: Params) => {
      this.paymentId = param.id;
      this.getPaymentById();
    }));
  }

  getPaymentById() {
    this.subscription.add(this.paymentsService.getPaymentById(this.paymentId).subscribe(response => {
      if (response) {
        this.paymentData = response;
      }
    }));
  }

  async deletePayment() {
    const alert = await this.alertCtrl.create({
      header: '¿Desea eliminar el cobro?',
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
            this.subscription.add(this.paymentsService.deletePayment(this.paymentData.uuid).subscribe(response => {
              if (response) {
                this.toastService.presentToast('Cobro eliminado correctamente', true);
                this.navCtrl.back();
              }
            }));
          }
        }
      ]
    });
    await alert.present();
  }

  goToDetail(customerSelected: Customer) {
    const navigationExtras: NavigationExtras = {
      state: { customer: customerSelected }
    };
    this.navCtrl.navigateForward(['tabs/customers/customer-detail'], navigationExtras);
  }

  editPayment() {
    const payment = this.paymentData;
    payment.customer = this.paymentData.customer;
    const navigationExtras: NavigationExtras = {

      queryParams: {
        payment: JSON.stringify(payment),
        hideWalkinClient: JSON.stringify(true)
      }
    };
    this.navCtrl.navigateBack(['tabs/payments'], navigationExtras);
  }

  cancel() {
    this.navCtrl.back();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
