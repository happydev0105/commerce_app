import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StadisticsPage } from './stadistics.page';

const routes: Routes = [
  {
    path: '',
    component: StadisticsPage
  },
  {
    path: 'non-payments',
    loadChildren: () => import('./non-payments/non-payments.module').then( m => m.NonPaymentsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StadisticsPageRoutingModule {}
