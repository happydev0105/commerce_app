import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupportTicketPageRoutingModule } from './support-ticket-routing.module';

import { SupportTicketPage } from './support-ticket.page';
import { HeaderModule } from 'src/app/shared/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SupportTicketPageRoutingModule,
    HeaderModule
  ],
  declarations: [SupportTicketPage]
})
export class SupportTicketPageModule {}
