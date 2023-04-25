import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingVideoPage } from './training-video.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingVideoPageRoutingModule {}
