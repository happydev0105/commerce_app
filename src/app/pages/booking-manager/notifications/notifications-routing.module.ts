import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsPage } from './notifications.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationsPage
  },
  {
    path: 'booking/:id',
    loadChildren: () =>
      import('../booking-item/booking-item.module').then(
        (m) => m.BookingItemPageModule
      ),
  },
  {
    path: 'reviews',
    loadChildren: () => import('../../profile/commerce-info/reviews/reviews.module').then(m => m.ReviewsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsPageRoutingModule {}
