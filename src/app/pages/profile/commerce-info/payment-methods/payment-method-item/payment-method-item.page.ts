import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PaymentMethodDto } from 'src/app/core/dto/payment-method.dto';
import { DeleteResult } from 'src/app/core/interfaces/delete-results.interface';
import { PaymentMethod } from 'src/app/core/models/payments-method/payment-method.model';
import { PaymentsMethodService } from 'src/app/core/services/payment-method/payments-method.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';

@Component({
  selector: 'app-payment-method-item',
  templateUrl: './payment-method-item.page.html',
  styleUrls: ['./payment-method-item.page.scss'],
})
export class PaymentMethodItemPage implements OnInit, OnDestroy {

  @ViewChild(AlertComponent) deleteAlert: AlertComponent;

  methodForm: FormGroup;
  method: PaymentMethod;
  isEdit = false;
  commerceLogged: string;
  title: string;
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private methodService: PaymentsMethodService,
    private navCtrl: NavController) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
    this.initForm();
    if (this.router.getCurrentNavigation().extras.state) {
      this.method = this.router.getCurrentNavigation().extras.state.method;
      this.label.setValue(this.method.label);
      this.isEdit = true;
      this.title = 'Editar método de pago';
    } else {
      this.title = 'Crear método de pago';
    }
  }


  get label() {
    return this.methodForm.get('label');
  }
  @HostListener('touchmove', ['$event'])
  onTouchMove(){
    const selection = window.getSelection();
    selection.removeAllRanges();
  }
  ngOnInit() {

  }

  initForm(): void {
    this.methodForm = this.fb.group(
      {
        label: [this.method ? this.method.label : '', Validators.required]
      });
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

  openAlert() {
    this.deleteAlert.presentAlertConfirm();
  }

  submit() {
    const methodDto: PaymentMethodDto = new PaymentMethodDto();
    methodDto.commerce = { uuid: this.commerceLogged };
    methodDto.label = this.label.value;

    if (this.isEdit) {
      methodDto.uuid = this.method.uuid;
    }

    this.subscription.add(this.methodService.createMethod(methodDto).subscribe(
      (res: PaymentMethod) => {
        if (res) {
          this.cancel();
        }
      }
    ));
  }
  cancel() {
    this.navCtrl.navigateBack(['tabs/profile/commerce-info/payment-methods'], { replaceUrl: true });
  }
  alertBox(value: boolean) {
    if (value) {
      this.deleteItem();
    }
  }
  deleteItem() {
    this.subscription.add(this.methodService.deleteMethod(this.method.uuid).subscribe((res: DeleteResult) => {

        this.cancel();
      
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
