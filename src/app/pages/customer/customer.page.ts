import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { CustomerFilterComponent } from './customer-filter/customer-filter.component';
import { CustomerService } from './../../core/services/customer/customer.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Customer } from 'src/app/core/models/customer/customer.model';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { IonRouterOutlet, IonSearchbar, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit, OnDestroy {

  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;

  customerCollection: Customer[] = [];
  customerCollectionFiltered: Customer[] = [];
  commerceLogged: Commerce;
  showNoData = false;
  customerSearch = '';
  subscription: Subscription = new Subscription();
  isReady = false;
  constructor(
    private customerService: CustomerService,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private routerOutlet: IonRouterOutlet,
    private navCtrl: NavController) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentCommerce'));
  }

  ionViewWillEnter() {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentCommerce'));
    this.getAllCustomerByCommerceAndCreatedBy();
    this.customerSearch = '';
    this.searchbar.value = '';
  }

  ngOnInit() { }

  getAllCustomerByCommerceAndCreatedBy() {
    this.subscription.add(this.customerService.getAllCustomerByCommerceAndCreatedBy(this.commerceLogged.uuid).subscribe(response => {
      if (response) {
        this.isReady = true;
        this.customerCollection = response;
        this.customerCollectionFiltered = this.customerCollection;
        if (this.customerCollection.length === 0) {
          this.showNoData = true;
        }
      }
    }));
  }

  goToDetail(customerSelected: Customer) {
    const navigationExtras: NavigationExtras = { relativeTo: this.activatedRoute };
    this.navCtrl.navigateForward([`customer-detail/${customerSelected.uuid}`], navigationExtras);
  }

  searchCustomer(event) {
    const value: string = event.target.value.split(' ').join('');
    this.customerSearch = event.target.value;
    this.customerCollectionFiltered = this.customerCollection;

    if (value.length >= 3) {
      this.customerCollectionFiltered = this.customerCollectionFiltered.filter(
        customer => {
          const name = customer.name.split(' ').join('');
          const lastname = customer.lastname.split(' ').join('');
          const together = name.concat(lastname);

          return together.toLowerCase().includes(value.toLowerCase());
        });
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CustomerFilterComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.filterCustomers(data.filter);

    }
  }

  filterCustomers(filter: string) {
    switch (filter) {
      case 'new':
        this.getCustomerByNewFilter(this.commerceLogged.uuid);
        break;
      case 'faithful':
        this.getCustomerByLoyaltyFilter(this.commerceLogged.uuid);
        break;
      case 'non-attendant':
        this.getCustomerByNonAttendantFilter(this.commerceLogged.uuid);
        break;
    }
  }

  getCustomerByNewFilter(commerceId: string) {
    this.subscription.add(this.customerService.getCustomersByRecentFilter(commerceId).subscribe(response => {
      this.customerCollection = response;
      this.customerCollectionFiltered = this.customerCollection;
    }));
  }

  getCustomerByLoyaltyFilter(commerceId: string) {
    this.subscription.add(this.customerService.getCustomersByLoyaltyFilter(commerceId).subscribe(response => {
      this.customerCollection = response;
      this.customerCollectionFiltered = this.customerCollection;
    }));
  }

  getCustomerByNonAttendantFilter(commerceId: string) {
    this.subscription.add(this.customerService.getCustomersByNonAttendantFilter(commerceId).subscribe(response => {
      this.customerCollection = response;
      this.customerCollectionFiltered = this.customerCollection;
    }));
  }

  goToCreate() {
    const navigationExtras: NavigationExtras = { state: { createFastCustomer: this.customerSearch } };
    this.navCtrl.navigateForward(['tabs/customers/customer-edit-detail'], navigationExtras);
  }

  isBanned(customerUUid: string) {
    return this.commerceLogged.bannedCustomers.some(customer => customer.uuid === customerUUid);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
