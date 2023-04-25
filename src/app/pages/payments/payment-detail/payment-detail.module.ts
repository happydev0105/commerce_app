import { GetImageModule } from './../../../core/pipes/get-image/get-image.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentDetailPageRoutingModule } from './payment-detail-routing.module';

import { PaymentDetailPage } from './payment-detail.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';
import { AvatarInitialsModule } from 'src/app/shared/components/avatar-initials/avatar-initials.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentDetailPageRoutingModule,
    HeaderModule,
    FormatPriceModule,
    GetImageModule,
    AvatarInitialsModule
  ],
  declarations: [PaymentDetailPage]
})
export class PaymentDetailPageModule {}
