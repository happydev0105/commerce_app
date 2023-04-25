import { NavController } from '@ionic/angular';
import { PaymentMethod } from './../../../core/models/payments-method/payment-method.model';
import { IPayment } from './../../../core/interfaces/payment.interface';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.page.html',
  styleUrls: ['./payment-confirmation.page.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class PaymentConfirmationPage implements OnInit {

  paymentData: IPayment;

  constructor(
    private router: Router,
    private navCtrl: NavController) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.paymentData = this.router.getCurrentNavigation().extras.state.payment;
    }
  }

  ngOnInit() { }

  goHome(){
    this.navCtrl.navigateForward(['tabs/home']);
  }
}
