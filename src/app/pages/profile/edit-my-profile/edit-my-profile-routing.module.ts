import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditMyProfilePage } from './edit-my-profile.page';

const routes: Routes = [
  {
    path: '',
    component: EditMyProfilePage
  },
  {
    path: 'select-hour',
    loadChildren: () => import('../../../shared/components/select-hour/select-hour.module').then((m) => m.SelectHourPageModule)
  },
  {
    path: 'select-role',
    loadChildren: () => import('../../profile/admin-employee/employee-detail/select-role/select-role.module')
      .then(m => m.SelectRolePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMyProfilePageRoutingModule {}
