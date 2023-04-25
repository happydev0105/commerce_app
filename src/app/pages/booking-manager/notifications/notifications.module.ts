import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsPageRoutingModule } from './notifications-routing.module';

import { NotificationsPage } from './notifications.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormatDateModule } from 'src/app/core/pipes/format-date/format-date.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsPageRoutingModule,
    HeaderModule,
    FormatDateModule
  ],
  declarations: [NotificationsPage]
})
export class NotificationsPageModule { }
