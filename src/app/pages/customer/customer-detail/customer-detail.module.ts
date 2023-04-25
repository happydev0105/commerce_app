import { GetImageModule } from './../../../core/pipes/get-image/get-image.module';
import { AlertModule } from './../../../shared/components/alert/alert.module';
import { HeaderModule } from './../../../shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomerDetailPageRoutingModule } from './customer-detail-routing.module';
import { CustomerDetailPage } from './customer-detail.page';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';
import { FormatHourModule } from 'src/app/core/pipes/format-hour/format-hour.module';
import { BookingStatusPipe } from 'src/app/shared/pipes/booking-status.pipe';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { FormatDateModule } from 'src/app/core/pipes/format-date/format-date.module';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';
import { AvatarInitialsModule } from 'src/app/shared/components/avatar-initials/avatar-initials.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerDetailPageRoutingModule,
    ReactiveFormsModule,
    HeaderModule,
    AlertModule,
    IonIntlTelInputModule,
    FormatDateModule,
    FormatHourModule,
    FormatPriceModule,
    GetImageModule,
    AvatarInitialsModule
  ],
  declarations: [CustomerDetailPage, BookingStatusPipe],
  providers:[CallNumber]
})
export class CustomerDetailPageModule { }
