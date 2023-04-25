import { NoDataModule } from './../../../shared/components/no-data/no-data.module';
import { HeaderModule } from './../../../shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqPageRoutingModule } from './faq-routing.module';

import { FaqPage } from './faq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqPageRoutingModule,
    HeaderModule,
    NoDataModule
  ],
  declarations: [FaqPage]
})
export class FaqPageModule {}
