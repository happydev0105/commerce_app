import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HolidayListPage } from './holiday-list.page';

const routes: Routes = [
  {
    path: '',
    component: HolidayListPage
  },
  {
    path: 'holiday/:id',
    loadChildren: () => import('./holiday/holiday.module').then(m => m.HolidayPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HolidayListPageRoutingModule { }
