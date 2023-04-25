import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'services',
    loadChildren: () => import('./services/services.module').then(m => m.ServicesPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsPageModule)
  },
  {
    path: 'training',
    loadChildren: () => import('./training/training.module').then(m => m.TrainingPageModule)
  },
  {
    path: 'commerce-info',
    loadChildren: () => import('./commerce-info/commerce-info.module').then(m => m.CommerceInfoPageModule)
  },
  {
    path: 'marketing',
    loadChildren: () => import('./marketing/marketing.module').then(m => m.MarketingPageModule)
  },
  {
    path: 'sms',
    loadChildren: () => import('./sms/sms.module').then(m => m.SmsModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then(m => m.FaqPageModule)
  },
  {
    path: 'billing',
    loadChildren: () => import('./billing/billing.module').then(m => m.BillingPageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then(m => m.SupportPageModule)
  },
  {
    path: 'stadistics',
    loadChildren: () => import('./stadistics/stadistics.module').then(m => m.StadisticsPageModule)
  },
  {
    path: 'rgpd',
    loadChildren: () => import('./rgpd/rgpd.module').then(m => m.RgpdPageModule)
  },  {
    path: 'edit-my-profile',
    loadChildren: () => import('./edit-my-profile/edit-my-profile.module').then( m => m.EditMyProfilePageModule)
  },
  {
    path: 'machine-learning',
    loadChildren: () => import('./machine-learning/machine-learning.module').then( m => m.MachineLearningPageModule)
  },
  {
    path: 'test-billing',
    loadChildren: () => import('./test-billing/test-billing.module').then( m => m.TestBillingPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule { }
