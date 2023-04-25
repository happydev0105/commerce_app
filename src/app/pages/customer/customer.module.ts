import { GetImageModule } from './../../core/pipes/get-image/get-image.module';
import { NoDataModule } from './../../shared/components/no-data/no-data.module';
import { CustomerFilterComponent } from './customer-filter/customer-filter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerPageRoutingModule } from './customer-routing.module';

import { CustomerPage } from './customer.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AvatarInitialsModule } from 'src/app/shared/components/avatar-initials/avatar-initials.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerPageRoutingModule,
    HeaderModule,
    NoDataModule,
    GetImageModule,
    AvatarInitialsModule
  ],
  declarations: [CustomerPage, CustomerFilterComponent]
})
export class CustomerPageModule {}
