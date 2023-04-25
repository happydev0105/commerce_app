import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimetablePageRoutingModule } from './timetable-routing.module';

import { TimetablePage } from './timetable.page';
import { SelectHourPageModule } from 'src/app/shared/components/select-hour/select-hour.module';
import { TranslateDaysModule } from 'src/app/core/pipes/translate-days/translate-days.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TimetablePageRoutingModule,
    HeaderModule,
    SelectHourPageModule,
    TranslateDaysModule
  ],
  declarations: [TimetablePage]
})
export class TimetablePageModule { }
