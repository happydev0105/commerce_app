import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';
import { NoDataModule } from './../no-data/no-data.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceListComponent } from './service-list.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ServiceListComponent],
  imports: [CommonModule, IonicModule, NoDataModule, FormatPriceModule],
  exports: [ServiceListComponent],
})
export class ServiceListModule {}
