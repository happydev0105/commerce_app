import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewBookingPage } from './new-booking.page';

const routes: Routes = [
  {
    path: '',
    component: NewBookingPage
  },
  {
    path: 'customer-detail',
    loadChildren: () => import('../../customer/customer-detail/customer-detail.module').then(m => m.CustomerDetailPageModule)
  },
  {
    path: 'customer-edit-detail',
    loadChildren: () => import('../../customer/customer-edit-detail/customer-edit-detail.module').then(m => m.CustomerEditDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewBookingPageRoutingModule { }
