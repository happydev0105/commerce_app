import { HeaderModule } from '../../../shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonAvailabilityPageRoutingModule } from './non-availability-routing.module';

import { NonAvailabilityPage } from './non-availability.page';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { TimeSelectorModule } from './../../../shared/components/time-selector/time-selector.module';
import { FormatHourModule } from 'src/app/core/pipes/format-hour/format-hour.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NonAvailabilityPageRoutingModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    MatFormFieldModule,
    AlertModule,
    HeaderModule,
    TimeSelectorModule,
    FormatHourModule
  ],
  declarations: [NonAvailabilityPage],
})
export class NonAvailabilityPageModule {}
