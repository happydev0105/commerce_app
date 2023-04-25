import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonPaymentsPage } from './non-payments.page';

const routes: Routes = [
  {
    path: '',
    component: NonPaymentsPage
  },
  {
    path: 'booking/:id',
    loadChildren: () =>
      import('../../..//booking-manager/booking-item/booking-item.module').then(
        (m) => m.BookingItemPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonPaymentsPageRoutingModule {}
