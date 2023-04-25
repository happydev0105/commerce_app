import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaqPage } from './faq.page';

const routes: Routes = [
  {
    path: '',
    component: FaqPage
  },
  {
    path: 'faq-detail',
    loadChildren: () => import('./faq-detail/faq-detail.module').then( m => m.FaqDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqPageRoutingModule {}
