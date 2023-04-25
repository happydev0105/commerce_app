import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerPage } from './customer.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerPage
  },
  {
    path: 'customer-edit-detail/:id',
    loadChildren: () => import('./customer-edit-detail/customer-edit-detail.module').then(m => m.CustomerEditDetailPageModule)
  },
  {
    path: 'customer-edit-detail',
    loadChildren: () => import('./customer-edit-detail/customer-edit-detail.module').then(m => m.CustomerEditDetailPageModule)
  },
  {
    path: 'customer-detail/:id',
    loadChildren: () => import('./customer-detail/customer-detail.module').then(m => m.CustomerDetailPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerPageRoutingModule { }
