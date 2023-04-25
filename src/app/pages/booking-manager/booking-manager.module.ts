import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingManagerPageRoutingModule } from './booking-manager-routing.module';

import { BookingManagerPage } from './booking-manager.page';
import { TimeTableModule } from 'src/app/shared/components/time-table/time-table.module';
import { DatetimeModule } from 'src/app/shared/components/datetime/datetime.module';
import { EmployeeModule } from 'src/app/shared/components/employee/employee.module';
import { ActionSheetModule } from 'src/app/shared/components/action-sheet/action-sheet.module';
import { EmployeeListModule } from 'src/app/shared/components/employee-list/employee-list.module';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BookingManagerPageRoutingModule,
    TimeTableModule,
    DatetimeModule,
    EmployeeModule,
    ActionSheetModule,
    EmployeeListModule,
    NoDataModule,
    MatDatepickerModule,
    MatNativeDateModule,

  ],
  declarations: [BookingManagerPage],
  providers:[ScreenOrientation]
})
export class BookingManagerPageModule { }
