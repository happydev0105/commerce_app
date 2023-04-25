import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductItemPage } from './product-item.page';

const routes: Routes = [
  {
    path: '',
    component: ProductItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductItemPageRoutingModule {}
