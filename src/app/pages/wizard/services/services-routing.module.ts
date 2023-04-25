import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicesWizardPage } from './services.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesWizardPage
  },
  {
    path: 'service-item',
    loadChildren: () => import('../../profile/services/services-item/services-item-routing.module')
    .then((m) => m.ServicesItemPageRoutingModule)
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesPageRoutingModule { }
