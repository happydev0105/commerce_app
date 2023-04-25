import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductItemPageRoutingModule } from './product-item-routing.module';

import { ProductItemPage } from './product-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductItemPageRoutingModule,
    HeaderModule,
    AlertModule
  ],
  declarations: [ProductItemPage]
})
export class ProductItemPageModule {}
