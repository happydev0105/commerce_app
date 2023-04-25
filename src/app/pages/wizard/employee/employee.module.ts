import { GetImageModule } from './../../../core/pipes/get-image/get-image.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeePageWizardRoutingModule } from './employee-routing.module';

import { EmployeePage } from './employee.page';
import { AvatarInitialsModule } from 'src/app/shared/components/avatar-initials/avatar-initials.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeePageWizardRoutingModule,
    HeaderModule,
    GetImageModule,
    AvatarInitialsModule
  ],
  declarations: [EmployeePage]
})
export class EmployeePageModule { }
