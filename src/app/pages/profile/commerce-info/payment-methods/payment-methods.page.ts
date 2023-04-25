import { NavController } from '@ionic/angular';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { PaymentMethod } from 'src/app/core/models/payments-method/payment-method.model';
import { PaymentsMethodService } from 'src/app/core/services/payment-method/payments-method.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnDestroy {

  methodCollection: PaymentMethod[] = [];
  methodCollectionFiltered: PaymentMethod[] = [];
  commerceLogged: string;
  subscription: Subscription = new Subscription();

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private methodService: PaymentsMethodService) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
  }


  ionViewWillEnter() {
    this.getAllMethods();
  }

  getAllMethods() {
    this.subscription.add(this.methodService.findPaymentMethodByCommerce(this.commerceLogged).subscribe((response: PaymentMethod[]) => {
      this.methodCollection = response;
      this.methodCollectionFiltered = this.methodCollection;
    }));
  }

  searchMethod(event) {
    const value: string = event.target.value;
    this.methodCollectionFiltered = this.methodCollection;

    if (value.length >= 3) {
      this.methodCollectionFiltered = this.methodCollectionFiltered.filter(
        option => option.label.toLowerCase().includes(value.toLowerCase()));
    }
  }



  goToDetail(method: PaymentMethod) {
    const navigationExtras: NavigationExtras = { state: { method }, relativeTo: this.activatedRoute };
    this.navCtrl.navigateForward(['payment-method-item'], navigationExtras);
  }

  goToCreate() {
    this.navCtrl.navigateForward(['payment-method-item'], { relativeTo: this.activatedRoute });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
