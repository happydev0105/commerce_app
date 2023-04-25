import { NoDataModule } from './../../../shared/components/no-data/no-data.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesPageRoutingModule } from './services-routing.module';

import { ServicesPage } from './services.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesPageRoutingModule,
    HeaderModule,
    NoDataModule,
    FormatPriceModule
  ],
  declarations: [ServicesPage]
})
export class ServicesPageModule {}
