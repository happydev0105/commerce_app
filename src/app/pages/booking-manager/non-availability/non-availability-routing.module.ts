import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonAvailabilityPage } from './non-availability.page';

const routes: Routes = [
  {
    path: '',
    component: NonAvailabilityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonAvailabilityPageRoutingModule {}
