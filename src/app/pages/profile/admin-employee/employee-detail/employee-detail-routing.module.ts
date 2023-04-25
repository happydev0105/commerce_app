import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeDetailPage } from './employee-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeDetailPage
  },
  {
    path: 'select-hour',
    loadChildren: () => import('../../../../shared/components/select-hour/select-hour.module').then((m) => m.SelectHourPageModule)
  },
  {
    path: 'holiday-list/:id',
    loadChildren: () => import('./holiday-list/holiday-list.module').then(m => m.HolidayListPageModule)
  },
  {
    path: 'select-role',
    loadChildren: () => import('./select-role/select-role.module').then(m => m.SelectRolePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeDetailPageRoutingModule { }
