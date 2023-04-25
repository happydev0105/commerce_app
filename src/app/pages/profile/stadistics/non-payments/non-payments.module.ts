import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonPaymentsPageRoutingModule } from './non-payments-routing.module';

import { NonPaymentsPage } from './non-payments.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormatHourModule } from 'src/app/core/pipes/format-hour/format-hour.module';
import { FormatDateModule } from 'src/app/core/pipes/format-date/format-date.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPaymentsPageRoutingModule,
    HeaderModule,
    FormatHourModule,
    FormatDateModule,
  ],
  declarations: [NonPaymentsPage]
})
export class NonPaymentsPageModule {}
