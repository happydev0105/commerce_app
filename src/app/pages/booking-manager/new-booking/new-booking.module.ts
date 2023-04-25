import { TimeSelectorModule } from './../../../shared/components/time-selector/time-selector.module';
import { SwiperModule } from 'swiper/angular';
import { HeaderModule } from './../../../shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewBookingPageRoutingModule } from './new-booking-routing.module';

import { NewBookingPage } from './new-booking.page';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { CustomerListModule } from 'src/app/shared/components/customer-list/customer-list.module';
import { ProductListModule } from 'src/app/shared/components/product-list/product-list.module';
import { FormatHourModule } from 'src/app/core/pipes/format-hour/format-hour.module';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewBookingPageRoutingModule,
    AlertModule,
    CustomerListModule,
    ProductListModule,
    HeaderModule,
    SwiperModule,
    TimeSelectorModule,
    FormatHourModule,
    FormatPriceModule
  ],
  declarations: [NewBookingPage],
})
export class NewBookingPageModule {}
