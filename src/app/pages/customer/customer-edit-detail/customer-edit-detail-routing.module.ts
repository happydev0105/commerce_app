import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingItemPage } from '../../booking-manager/booking-item/booking-item.page';

import { CustomerEditDetailPage } from './customer-edit-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerEditDetailPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerEditDetailPageRoutingModule { }
