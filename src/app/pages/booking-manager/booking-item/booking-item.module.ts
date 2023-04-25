import { GetImageModule } from './../../../core/pipes/get-image/get-image.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingItemPageRoutingModule } from './booking-item-routing.module';

import { BookingItemPage } from './booking-item.page';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { AlertNonAttendedModule } from 'src/app/shared/components/alert-non-attended/alert-non-attended.module';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';
import { AvatarInitialsModule } from 'src/app/shared/components/avatar-initials/avatar-initials.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingItemPageRoutingModule,
    AlertModule,
    AlertNonAttendedModule,
    FormatPriceModule,
    GetImageModule,
    AvatarInitialsModule
  ],
  declarations: [BookingItemPage],
})
export class BookingItemPageModule {}
