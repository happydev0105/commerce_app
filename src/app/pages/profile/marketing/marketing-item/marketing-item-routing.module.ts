import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketingItemPage } from './marketing-item.page';

const routes: Routes = [
  {
    path: '',
    component: MarketingItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingItemPageRoutingModule {}
