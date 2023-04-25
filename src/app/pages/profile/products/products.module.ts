import { NoDataModule } from './../../../shared/components/no-data/no-data.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    HeaderModule,
    NoDataModule,
    FormatPriceModule
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
