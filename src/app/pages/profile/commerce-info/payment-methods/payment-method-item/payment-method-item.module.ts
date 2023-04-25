import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentMethodItemPageRoutingModule } from './payment-method-item-routing.module';

import { PaymentMethodItemPage } from './payment-method-item.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PaymentMethodItemPageRoutingModule,
    HeaderModule,
    AlertModule
  ],
  declarations: [PaymentMethodItemPage]
})
export class PaymentMethodItemPageModule { }
