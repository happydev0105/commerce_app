import { GetImageModule } from './../../../core/pipes/get-image/get-image.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeComponent } from './employee.component';
import { IonicModule } from '@ionic/angular';
import { AvatarInitialsModule } from '../avatar-initials/avatar-initials.module';

@NgModule({
  declarations: [EmployeeComponent],
  imports: [CommonModule, IonicModule, GetImageModule, AvatarInitialsModule],
  exports: [EmployeeComponent],
})
export class EmployeeModule {}
