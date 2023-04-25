import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentsPage } from './payments.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentsPage,

  },

  {
    path: 'customer-edit-detail',
    loadChildren: () => import('../customer/customer-edit-detail/customer-edit-detail.module').then(m => m.CustomerEditDetailPageModule)
  },
  {
    path: 'payment-detail/:id',
    loadChildren: () => import('./payment-detail/payment-detail.module').then(m => m.PaymentDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsPageRoutingModule { }
