import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesItemPage } from './services-item.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesItemPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesItemPageRoutingModule {}
