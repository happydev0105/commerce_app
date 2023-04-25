import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SmsConfirmationPageRoutingModule } from './sms-confirmation-routing.module';

import { SmsConfirmationPage } from './sms-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SmsConfirmationPageRoutingModule
  ],
  declarations: [SmsConfirmationPage]
})
export class SmsConfirmationPageModule {}
