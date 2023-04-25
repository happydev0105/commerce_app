import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommerceDataPageRoutingModule } from './commerce-data-routing.module';

import { CommerceDataPage } from './commerce-data.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';
import { TranslateDaysModule } from 'src/app/core/pipes/translate-days/translate-days.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommerceDataPageRoutingModule,
    HeaderModule,
    ReactiveFormsModule,
    AlertModule,
    IonIntlTelInputModule,
    TranslateDaysModule
  ],
  declarations: [CommerceDataPage]
})
export class CommerceDataPageModule { }
