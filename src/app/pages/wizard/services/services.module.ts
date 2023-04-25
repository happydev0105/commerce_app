import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesPageRoutingModule } from './services-routing.module';

import { ServicesWizardPage } from './services.page';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesPageRoutingModule,
    HeaderModule,
    FormatPriceModule
  ],
  declarations: [ServicesWizardPage]
})
export class ServicesPageModule { }
