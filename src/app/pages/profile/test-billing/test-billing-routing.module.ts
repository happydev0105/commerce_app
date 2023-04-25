import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestBillingPage } from './test-billing.page';

const routes: Routes = [
  {
    path: '',
    component: TestBillingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestBillingPageRoutingModule {}
