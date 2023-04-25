import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonAvailabilityPage } from './non-availability/non-availability.page';

import { BookingManagerPage } from './booking-manager.page';

const routes: Routes = [
  {
    path: '',
    component: BookingManagerPage,
  },
  {
    path: 'new-booking',
    loadChildren: () =>
      import('./new-booking/new-booking.module').then(
        (m) => m.NewBookingPageModule
      ),
  },
  {
    path: 'non-availability',
    loadChildren: () =>
      import('./non-availability/non-availability.module').then(
        (m) => m.NonAvailabilityPageModule
      ),
  },
  {
    path: 'booking/:id',
    loadChildren: () =>
      import('./booking-item/booking-item.module').then(
        (m) => m.BookingItemPageModule
      ),
  },
  {
    path: 'non-availability/:id',
    loadChildren: () =>
      import('./non-availability/non-availability.module').then(
        (m) => m.NonAvailabilityPageModule
      ),
  },
  {
    path: 'new-booking/:id',
    loadChildren: () =>
      import('./new-booking/new-booking.module').then(
        (m) => m.NewBookingPageModule
      ),
  },  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingManagerPageRoutingModule { }
