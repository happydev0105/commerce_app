import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MachineLearningPage } from './machine-learning.page';

const routes: Routes = [
  {
    path: '',
    component: MachineLearningPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MachineLearningPageRoutingModule {}
