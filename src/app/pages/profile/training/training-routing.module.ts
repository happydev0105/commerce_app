import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingPage } from './training.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingPage
  },
  {
    path: 'training-video',
    loadChildren: () => import('./training-video/training-video.module').then(m => m.TrainingVideoPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingPageRoutingModule { }
