import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HolidayPageRoutingModule } from './holiday-routing.module';

import { HolidayPage } from './holiday.page';
import { NgxMatTimepickerModule, NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { HeaderModule } from 'src/app/shared/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HolidayPageRoutingModule,
        NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    MatFormFieldModule,
    AlertModule,
    HeaderModule
  ],
  declarations: [HolidayPage]
})
export class HolidayPageModule {}
