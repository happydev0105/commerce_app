import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RgpdPage } from './rgpd.page';

const routes: Routes = [
  {
    path: '',
    component: RgpdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RgpdPageRoutingModule {}
