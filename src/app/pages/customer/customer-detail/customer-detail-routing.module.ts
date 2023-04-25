import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingItemPage } from '../../booking-manager/booking-item/booking-item.page';

import { CustomerDetailPage } from './customer-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerDetailPage,

  },
  {
    path: 'edit-customer',
    loadChildren: () =>
      import('../customer-edit-detail/customer-edit-detail.module').then(
        (m) => m.CustomerEditDetailPageModule
      ),
  },
  {
    path: 'sms',
    loadChildren: () => import('../../profile/sms/sms.module').then(m => m.SmsModule)
  },
  {
    path: 'customer-notes/:id',
    loadChildren: () => import('../customer-notes/customer-notes.module').then(m => m.CustomerNotesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerDetailPageRoutingModule { }
