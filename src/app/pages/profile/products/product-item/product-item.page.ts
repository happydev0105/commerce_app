import { NavController } from '@ionic/angular';
import { ProductDto } from './../../../../core/models/product/product.dto';
import { ProductService } from 'src/app/core/services/product/product.service';
import { Product } from 'src/app/core/models/product/product.model';
import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.page.html',
  styleUrls: ['./product-item.page.scss'],
})
export class ProductItemPage implements OnInit, OnDestroy {

  @ViewChild(AlertComponent) deleteAlert: AlertComponent;

  isEdit = false;
  commerceLogged: string;
  title: string;

  product: Product;
  productForm: FormGroup;

  subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private navCtrl: NavController) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
    this.initForms();
    if (this.router.getCurrentNavigation().extras.state) {
      this.product = this.router.getCurrentNavigation().extras.state.product;
      this.name.setValue(this.product.name);
      this.price.setValue((this.product.price + (this.product.decimal / 100)).toFixed(2));
      this.description.setValue(this.product.description);
      this.reference.setValue(this.product.reference);
      this.qty.setValue(this.product.qty);
      this.isEdit = true;
      this.title = 'Editar producto';
    } else {
      this.title = 'Crear producto';
    }
  }


  get name() {
    return this.productForm.get('name');
  }
  get reference() {
    return this.productForm.get('reference');
  }
  get price() {
    return this.productForm.get('price');
  }
  get description() {
    return this.productForm.get('description');
  }
  get qty() {
    return this.productForm.get('qty');
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ngOnInit() {
  }

  initForms() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      reference: [''],
      price: [, [Validators.required, Validators.min(0)]],
      qty: [, [Validators.required, Validators.min(0), Validators.max(100)]],
      description: ['']
    });
  }

  submit() {
    const productDto = new ProductDto();
    productDto.name = this.name.value;
    productDto.reference = this.reference.value;
    productDto.description = this.description.value;
    productDto.commerce = this.commerceLogged;
    productDto.qty = this.qty.value;

    if (this.price.value.includes('.')) {
      const splittedPrice = this.price.value.split('.');
      productDto.price = Number.parseInt(splittedPrice[0], 10);
      productDto.decimal = Number.parseInt(splittedPrice[1], 10);
    } else if (this.price.value.includes(',')) {
      const splittedPrice = this.price.value.split(',');
      productDto.price = Number.parseInt(splittedPrice[0], 10);
      productDto.decimal = Number.parseInt(splittedPrice[1], 10);
    } else {
      productDto.price = Number.parseFloat(this.price.value);
      productDto.decimal = 0;
    }

    if (this.isEdit) {
      productDto.uuid = this.product.uuid;
      this.subscription.add(this.productService.update(productDto).subscribe(res => {
        if (res) {
          this.cancel();
        }
      }));
    } else {
      this.subscription.add(this.productService.create(productDto).subscribe(res => {
        if (res) {
          this.cancel();
        }
      }));
    }
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

  onChange(event) {
    if (event.detail.value) {
      const qtyParsed = Number.parseInt(event.detail.value, 10);
      if (!Number.isNaN(qtyParsed)) {
        this.productForm.get('qty').setValue(qtyParsed.toString());
      }
    }
  }

  formatPrice(event) {
    let price: string = event.detail.value;
    if (price) {
      if (price.includes('.') || price.includes(',')) {
        console.log('bumbi');
        const index = price.indexOf('.') !== -1 ? price.indexOf('.') : price.indexOf(',');
        price = price.substring(0, index + 3);
      }
      this.productForm.get('price').setValue(price);
    }
  }

  openAlert() {
    this.deleteAlert.presentAlertConfirm();
  }

  cancel() {
    this.navCtrl.navigateBack(['tabs/profile/products'], { replaceUrl: true });
  }
  alertBox(value: boolean) {
    if (value) {
      this.deleteItem();
    }
  }
  deleteItem() {
    this.subscription.add(this.productService.deleteProduct(this.product.uuid).subscribe((res) => {
      if (res) {
        this.cancel();
      }
    }));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
