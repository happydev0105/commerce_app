import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillingPage } from './billing.page';

const routes: Routes = [
  {
    path: '',
    component: BillingPage
  },
  {
    path: 'booking/:id',
    loadChildren: () =>
      import('../../booking-manager/booking-item/booking-item.module').then(
        (m) => m.BookingItemPageModule
      ),
  },
  {
    path: 'payment-detail/:id',
    loadChildren: () =>
      import('../../payments/payment-detail/payment-detail.module').then(
        (m) => m.PaymentDetailPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingPageRoutingModule { }
