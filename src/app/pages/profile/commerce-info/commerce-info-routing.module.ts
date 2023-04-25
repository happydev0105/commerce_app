import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommerceInfoPage } from './commerce-info.page';

const routes: Routes = [
  {
    path: '',
    component: CommerceInfoPage
  },
  {
    path: 'admin-employee',
    loadChildren: () => import('../admin-employee/admin-employee.module').then(m => m.AdminEmployeePageModule)
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./payment-methods/payment-methods.module').then(m => m.PaymentMethodsPageModule)
  },
  {
    path: 'subscription',
    loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionPageModule)
  },
  {
    path: 'commerce-data',
    loadChildren: () => import('./commerce-data/commerce-data.module').then(m => m.CommerceDataPageModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsPageModule)
  },
  {
    path: 'gallery',
    loadChildren: () => import('./gallery/gallery.module').then( m => m.GalleryPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then(m => m.LocationPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommerceInfoPageRoutingModule { }
