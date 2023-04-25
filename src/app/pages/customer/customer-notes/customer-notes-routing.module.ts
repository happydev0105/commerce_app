import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerNotesPage } from './customer-notes.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerNotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerNotesPageRoutingModule {}
