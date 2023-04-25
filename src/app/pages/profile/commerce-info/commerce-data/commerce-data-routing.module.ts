import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommerceDataPage } from './commerce-data.page';

const routes: Routes = [
  {
    path: '',
    component: CommerceDataPage
  },
  {
    path: 'select-hour',
    loadChildren: () => import('../../../../shared/components/select-hour/select-hour.module').then((m) => m.SelectHourPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommerceDataPageRoutingModule { }
