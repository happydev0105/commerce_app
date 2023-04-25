import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupportTicketPage } from './support-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: SupportTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportTicketPageRoutingModule {}
