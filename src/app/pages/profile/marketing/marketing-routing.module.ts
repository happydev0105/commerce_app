import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketingPage } from './marketing.page';

const routes: Routes = [
  {
    path: '',
    component: MarketingPage
  },
  {
    path: 'marketing-item',
    loadChildren: () => import('./marketing-item/marketing-item.module').then( m => m.MarketingItemPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingPageRoutingModule {}
