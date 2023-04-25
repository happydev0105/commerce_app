import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesItemPageRoutingModule } from './services-item-routing.module';

import { ServicesItemPage } from './services-item.page';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { ColorListModule } from 'src/app/shared/components/color-list/color-list.module';
import { TimeSelectorModule } from 'src/app/shared/components/time-selector/time-selector.module';
import { FormatHourModule } from 'src/app/core/pipes/format-hour/format-hour.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ServicesItemPageRoutingModule,
    AlertModule,
    ColorListModule,
    HeaderModule,
    TimeSelectorModule,
    FormatHourModule
  ],
  declarations: [ServicesItemPage]
})
export class ServicesItemPageModule { }
