import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentMethodItemPage } from './payment-method-item.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodItemPageRoutingModule {}
