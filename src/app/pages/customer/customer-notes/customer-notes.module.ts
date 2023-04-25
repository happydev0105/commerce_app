import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomerNotesPageRoutingModule } from './customer-notes-routing.module';
import { CustomerNotesPage } from './customer-notes.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerNotesPageRoutingModule,
    HeaderModule,
    NoDataModule
  ],
  declarations: [CustomerNotesPage]
})
export class CustomerNotesPageModule { }
