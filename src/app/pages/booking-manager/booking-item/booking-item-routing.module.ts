import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingItemPage } from './booking-item.page';

const routes: Routes = [
  {
    path: '',
    component: BookingItemPage
  },
  {
    path: 'payments',
    loadChildren: () =>
      import('../../payments/payments.module').then(
        (m) => m.PaymentsPageModule
      ),
  },
  {
    path: 'booking-edit/:id',
    loadChildren: () =>
      import('../new-booking/new-booking.module').then(
        (m) => m.NewBookingPageModule
      ),
  },
  {
    path: 'customer-detail/:id',
    loadChildren: () =>
      import('../../customer/customer-detail/customer-detail.module').then(
        (m) => m.CustomerDetailPageModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingItemPageRoutingModule { }
