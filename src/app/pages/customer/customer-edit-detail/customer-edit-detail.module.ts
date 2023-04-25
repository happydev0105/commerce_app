import { GetImageModule } from './../../../core/pipes/get-image/get-image.module';
import { AlertModule } from '../../../shared/components/alert/alert.module';
import { HeaderModule } from '../../../shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomerEditDetailPageRoutingModule } from './customer-edit-detail-routing.module';
import { CustomerEditDetailPage } from './customer-edit-detail.page';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';
import { FormatHourModule } from 'src/app/core/pipes/format-hour/format-hour.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerEditDetailPageRoutingModule,
    ReactiveFormsModule,
    HeaderModule,
    AlertModule,
    IonIntlTelInputModule,
    FormatHourModule,
    GetImageModule
  ],
  declarations: [CustomerEditDetailPage]
})
export class CustomerEditDetailPageModule { }
