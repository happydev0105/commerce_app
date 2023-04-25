import { NoDataModule } from './../../../shared/components/no-data/no-data.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupportPageRoutingModule } from './support-routing.module';

import { HeaderModule } from 'src/app/shared/header/header.module';
import { SupportPage } from './support.page';
import { TicketStatusPipe } from 'src/app/shared/pipes/ticket-status.pipe';
import { TicketFilterComponent } from './ticket-filter/ticket-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SupportPageRoutingModule,
    HeaderModule,
    NoDataModule
  ],
  declarations: [SupportPage, TicketStatusPipe, TicketFilterComponent]
})
export class SupportPageModule {}
