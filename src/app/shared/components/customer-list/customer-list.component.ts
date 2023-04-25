import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { IonSearchbar, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { Customer } from 'src/app/core/models/customer/customer.model';
import { CustomerService } from 'src/app/core/services/customer/customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, OnDestroy {

  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;

  customerCollection: Customer[] = [];
  customerCollectionFiltered: Customer[] = [];
  selectedCustomer: Customer;
  commerceLogged: Commerce;
  customerSearch = '';
  showNoData = false;
  isNewBooking = false;
  isNewPayment = false;
  isReady = false;
  subscription: Subscription = new Subscription();
  constructor(
    private customerService: CustomerService,
    private modalCtrl: ModalController,
    private navCtrl: NavController) {
    //this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')) as Customer;
    this.commerceLogged = JSON.parse(localStorage.getItem('currentCommerce')) as Commerce;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ionViewWillEnter() {
    this.customerSearch = '';
    this.searchbar.value = '';
  }

  isBanned(customerUUid: string): boolean {
    return this.commerceLogged.bannedCustomers.some(customer => customer.uuid === customerUUid);
  }

  ngOnInit() {
    this.getAllCustomerByCommerceAndCreatedBy();
  }

  getAllCustomerByCommerceAndCreatedBy() {
    this.subscription.add(
      this.customerService.getAllCustomerByCommerceAndCreatedBy(this.commerceLogged.uuid).subscribe((res: Customer[]) => {
        this.isReady = true;
        if (res) {
          this.customerCollection = res;
          this.customerCollectionFiltered = this.customerCollection;
          if (this.customerCollection.length === 0) {
            this.showNoData = true;
          }
        }
      }));

  }
  selectCustomer(item: Customer) {
    this.selectedCustomer = item;
    this.dismiss();
  }
  searchCustomer(event) {
    const value: string = event.target.value;
    this.customerSearch = value;
    this.customerCollectionFiltered = this.customerCollection;

    if (value.length >= 3) {
      this.customerCollectionFiltered = this.customerCollectionFiltered.filter(
        customer => {
          const name = customer.name.split(" ").join("");
          const lastname = customer.lastname.split(" ").join("");
          const together = name.concat(lastname);
          return together.toLowerCase().includes(value.toLowerCase());
        }
      );
    }
  }

  async goToCreate() {
    await this.modalCtrl.dismiss();
    if (this.isNewBooking) {
      const navigationExtras: NavigationExtras = {
        state: { createFastCustomer: '', isNewBooking: this.isNewBooking, isNewPayment: this.isNewPayment }
      };
      this.navCtrl.navigateForward(['tabs/home/new-booking/customer-edit-detail'], navigationExtras);
    } else if (this.isNewPayment) {
      const navigationExtras: NavigationExtras = {
        state: { createFastCustomer: '', isNewBooking: this.isNewBooking, isNewPayment: this.isNewPayment }
      };
      this.navCtrl.navigateForward(['tabs/payments/customer-edit-detail'], navigationExtras);
    }

  }

  dismiss() {
    this.modalCtrl.dismiss({
      customer: this.selectedCustomer
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
