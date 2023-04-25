import { GetImageModule } from './../../../core/pipes/get-image/get-image.module';
import { NoDataModule } from './../../../shared/components/no-data/no-data.module';
import { HeaderModule } from './../../../shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminEmployeePageRoutingModule } from './admin-employee-routing.module';

import { AdminEmployeePage } from './admin-employee.page';
import { AvatarInitialsModule } from 'src/app/shared/components/avatar-initials/avatar-initials.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminEmployeePageRoutingModule,
    HeaderModule,
    NoDataModule,
    GetImageModule,
    AvatarInitialsModule
  ],
  declarations: [AdminEmployeePage]
})
export class AdminEmployeePageModule {}
