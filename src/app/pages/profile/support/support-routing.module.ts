import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupportPage } from './support.page';

const routes: Routes = [
  {
    path: '',
    component: SupportPage
  },
  {
    path: 'support-ticket',
    loadChildren: () => import('./support-ticket/support-ticket.module').then( m => m.SupportTicketPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportPageRoutingModule {}
