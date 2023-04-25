import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestBillingPageRoutingModule } from './test-billing-routing.module';

import { TestBillingPage } from './test-billing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestBillingPageRoutingModule
  ],
  declarations: [TestBillingPage]
})
export class TestBillingPageModule {}
