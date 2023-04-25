import { GetImageModule } from './../../../../core/pipes/get-image/get-image.module';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { HeaderModule } from './../../../../shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeDetailPageRoutingModule } from './employee-detail-routing.module';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

import { EmployeeDetailPage } from './employee-detail.page';
import { TranslateDaysModule } from 'src/app/core/pipes/translate-days/translate-days.module';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EmployeeDetailPageRoutingModule,
    HeaderModule,
    AlertModule,
    IonIntlTelInputModule,
    TranslateDaysModule,
    FormatPriceModule,
    GetImageModule
  ],
  declarations: [EmployeeDetailPage]
})
export class EmployeeDetailPageModule { }
