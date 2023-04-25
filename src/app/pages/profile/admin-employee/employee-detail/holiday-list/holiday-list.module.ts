import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HolidayListPageRoutingModule } from './holiday-list-routing.module';

import { HolidayListPage } from './holiday-list.page';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HolidayListPageRoutingModule,
    HeaderModule,
    AlertModule,
    NoDataModule
  ],
  declarations: [HolidayListPage]
})
export class HolidayListPageModule { }
