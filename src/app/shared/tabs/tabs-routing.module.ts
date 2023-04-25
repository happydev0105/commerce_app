import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../../pages/booking-manager/booking-manager.module').then(
            (m) => m.BookingManagerPageModule
          ),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('../../pages/customer/customer.module').then(
            (m) => m.CustomerPageModule
          ),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('../../pages/payments/payments.module').then(
            (m) => m.PaymentsPageModule
          ),
      },
     
      {
        path: 'profile',
        loadChildren: () =>
          import('../../pages/profile/profile.module').then(
            (m) => m.ProfilePageModule
          ),
      },

      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
