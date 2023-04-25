import { GetImageModule } from './../../../core/pipes/get-image/get-image.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeListComponent } from './employee-list.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [EmployeeListComponent],
  imports: [
    CommonModule, IonicModule, GetImageModule
  ]
})
export class EmployeeListModule { }
