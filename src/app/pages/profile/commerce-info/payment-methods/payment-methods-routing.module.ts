import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentMethodsPage } from './payment-methods.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodsPage
  },
  {
    path: 'payment-method-item',
    loadChildren: () => import('./payment-method-item/payment-method-item.module').then( m => m.PaymentMethodItemPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodsPageRoutingModule {}
