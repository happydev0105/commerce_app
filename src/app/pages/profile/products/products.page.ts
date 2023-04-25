import { NavController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ProductService } from 'src/app/core/services/product/product.service';
import { Component, OnDestroy } from '@angular/core';
import { Product } from 'src/app/core/models/product/product.model';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnDestroy {
  productAlert = new BehaviorSubject<boolean>(false);
  commerceLogged: string;
  productCollection: Product[] = [];
  productCollectionFiltered: Product[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private navCtrl: NavController,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
  }

  ionViewWillEnter() {
    this.getProductsByCommerce();
  }

  getProductsByCommerce() {
    this.subscription.add(this.productService.getByCommerce(this.commerceLogged).subscribe(response => {
      this.productCollection = response;
      this.productCollectionFiltered = this.productCollection;
      this.productAlert.next(response.some((item: Product) => item.qty < 5));
    }));
  }

  searchProduct(event) {
    const value: string = event.target.value;
    this.productCollectionFiltered = this.productCollection;

    if (value.length >= 3) {
      this.productCollectionFiltered = this.productCollectionFiltered.filter(
        product => product.name.toLowerCase().includes(value.toLowerCase()));
    }
  }

  goToDetail(product: Product) {
    const navigationExtras: NavigationExtras = { relativeTo: this.activatedRoute, state: { product } };
    this.navCtrl.navigateForward(['product-item'], navigationExtras);
  }

  goToCreate() {
    this.navCtrl.navigateForward(['product-item'], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
