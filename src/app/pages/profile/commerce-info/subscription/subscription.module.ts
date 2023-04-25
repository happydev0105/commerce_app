import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionPageRoutingModule } from './subscription-routing.module';

import { SubscriptionPage } from './subscription.page';
import { ChangeCharForAsteriskPipe } from 'src/app/shared/pipes/change-char-for-asterisk.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SubscriptionPageRoutingModule,
    HeaderModule
  ],
  declarations: [SubscriptionPage, ChangeCharForAsteriskPipe]
})
export class SubscriptionPageModule {}
