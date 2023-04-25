import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimetablePage } from './timetable.page';

const routes: Routes = [
  {
    path: '',
    component: TimetablePage
  },
  {
    path: 'select-hour',
    loadChildren: () => import('../../../shared/components/select-hour/select-hour.module').then((m) => m.SelectHourPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimetablePageRoutingModule { }
