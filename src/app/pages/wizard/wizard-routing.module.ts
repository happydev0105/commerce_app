import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WizardPage } from './wizard.page';

const routes: Routes = [
  {
    path: '',
    component: WizardPage
  },
  {
    path: 'timetable',
    loadChildren: () => import('./timetable/timetable.module').then( m => m.TimetablePageModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./services/services.module').then( m => m.ServicesPageModule)
  },
  {
    path: 'employee',
    loadChildren: () => import('./employee/employee.module').then( m => m.EmployeePageModule)
  },
  {
    path: 'ready',
    loadChildren: () => import('./ready/ready.module').then( m => m.ReadyPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WizardPageRoutingModule {}
