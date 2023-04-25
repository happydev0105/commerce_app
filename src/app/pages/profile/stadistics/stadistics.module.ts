import { GetImageModule } from './../../../core/pipes/get-image/get-image.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StadisticsPageRoutingModule } from './stadistics-routing.module';
import { StadisticsPage } from './stadistics.page';
import { NgChartsModule } from 'ng2-charts';
import { DynamicSelectorModule } from 'src/app/shared/components/dynamic-selector/dynamic-selector.module';
import { DateSelectorModule } from 'src/app/shared/components/date-selector/date-selector.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StadisticsPageRoutingModule,
    HeaderModule,
    NgChartsModule,
    GetImageModule,
    DynamicSelectorModule,
    DateSelectorModule
  ],
  declarations: [StadisticsPage],
})
export class StadisticsPageModule { }
