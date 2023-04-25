import { NoDataModule } from './../../../shared/components/no-data/no-data.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillingPageRoutingModule } from './billing-routing.module';

import { BillingPage } from './billing.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormatDateModule } from 'src/app/core/pipes/format-date/format-date.module';
import { FormatHourModule } from 'src/app/core/pipes/format-hour/format-hour.module';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';
import { RangeSelectorModule } from 'src/app/shared/components/range-selector/range-selector.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillingPageRoutingModule,
    HeaderModule,
    NoDataModule,
    FormatDateModule,
    FormatHourModule,
    FormatPriceModule,
    RangeSelectorModule
  ],
  declarations: [BillingPage]
})
export class BillingPageModule { }
