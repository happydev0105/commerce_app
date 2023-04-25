import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Product } from 'src/app/core/models/product/product.model';
import { ProductService } from 'src/app/core/services/product/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {

  productCollection: Product[] = [];
  productCollectionFiltered: Product[] = [];
  selectedProduct: Product[] = [];
  qtySelected = [];
  productSelected: Product[] = [];
  qtyProductCollection: any[] = [];
  commerceLogged: string;
  subscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private modalCtrl: ModalController,
    public navParams: NavParams) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
    const productsAlreadySelected = this.navParams.get('productSelected');
    if (productsAlreadySelected.length > 0) {
      this.selectedProduct = productsAlreadySelected;
    }
  }


  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.subscription.add(this.productService.getByCommerce(this.commerceLogged).subscribe(response => {
      this.productCollection = response;
      this.productCollectionFiltered = this.productCollection;
      this.productCollectionFiltered.forEach(product => {
        this.qtyProductCollection.push(this.generateQtyArray(product));
      })
    }));
  }

  searchProduct(event) {
    const value: string = event.target.value;
    this.productCollectionFiltered = this.productCollection;

    if (value.length >= 3) {
      this.productCollectionFiltered = this.productCollectionFiltered.filter(
        (product) => product.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  dismiss(withProduct: boolean) {
    withProduct ? this.modalCtrl.dismiss(this.productSelected) : this.modalCtrl.dismiss();
  }

  onChangeValue(event, product: Product, indexProduct: number) {
    const qty = event.detail.value;
    const productSelected = this.productCollection.find(item => item.uuid === product.uuid);
    const cardFromProduct = document.getElementById(`card_${indexProduct}`);
    if (qty !== 0) {
      if(this.productSelected.some(productItem =>productItem.uuid === productSelected.uuid)){
        productSelected.qty = qty;
      }else{
 productSelected.qty = qty;
        this.productSelected.push(productSelected);
      }
    
      cardFromProduct.classList.add('fill-input');
    } else {
      const productIndex = this.productSelected.findIndex(item => item.uuid === product.uuid);
      if (productIndex !== -1) {
        this.productSelected.splice(productIndex, 1);
      }
      if (cardFromProduct.classList.contains('fill-input')) {
        cardFromProduct.classList.remove('fill-input');
      }
    }
  }

  generateQtyArray(product: Product) {

    const qtyArray: number[] = [];
    for (let i = 0; i <= product.qty; i++)
      qtyArray.push(i);
    return qtyArray;
  }

  setSelectedClass(selectedProduct: Product): string {
    let classToApply = '';
    const findProduct = this.selectedProduct.find(item => item.uuid === selectedProduct.uuid);
    if (findProduct) {
      classToApply = 'fill-input';
    }
    return classToApply;
  }

  selectProduct(product: Product) {
    const select: any = document.getElementById(product.uuid);
    if (select) { select.open(); }
  }

  setSelectOptionValue(product: Product): number {
    if (this.selectedProduct.length > 0) {
      const findProduct = this.selectedProduct.find(item => item.uuid === product.uuid);
      if (findProduct) {
        return findProduct.qty;
      }
    }
    return 0;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
