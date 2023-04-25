import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormatHourModule } from 'src/app/core/pipes/format-hour/format-hour.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { TimeSelectorModule } from '../time-selector/time-selector.module';
import { SelectHourPageRoutingModule } from './select-hour-routing.module';
import { SelectHourPage } from './select-hour.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SelectHourPageRoutingModule,
    HeaderModule,
    TimeSelectorModule,
    FormatHourModule
  ],
  declarations: [SelectHourPage]
})
export class SelectHourPageModule { }
