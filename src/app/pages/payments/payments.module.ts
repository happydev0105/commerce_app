import { AlertModule } from './../../shared/components/alert/alert.module';
import { HeaderModule } from './../../shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentsPageRoutingModule } from './payments-routing.module';

import { PaymentsPage } from './payments.page';
import { ServiceListModule } from 'src/app/shared/components/service-list/service-list.module';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PaymentsPageRoutingModule,
    ServiceListModule,
    HeaderModule,
    AlertModule,
    FormatPriceModule
  ],
  declarations: [PaymentsPage],
})
export class PaymentsPageModule {}
