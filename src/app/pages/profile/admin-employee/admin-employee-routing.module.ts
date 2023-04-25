import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminEmployeePage } from './admin-employee.page';

const routes: Routes = [
  {
    path: '',
    component: AdminEmployeePage
  },
  {
    path: 'employee-detail',
    loadChildren: () => import('./employee-detail/employee-detail.module').then( m => m.EmployeeDetailPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminEmployeePageRoutingModule {}
