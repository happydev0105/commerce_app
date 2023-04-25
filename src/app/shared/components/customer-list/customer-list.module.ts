import { GetImageModule } from './../../../core/pipes/get-image/get-image.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list.component';
import { IonicModule } from '@ionic/angular';
import { AvatarInitialsModule } from '../avatar-initials/avatar-initials.module';

@NgModule({
  declarations: [CustomerListComponent],
  imports: [CommonModule, IonicModule, GetImageModule, AvatarInitialsModule],
  exports: [CustomerListComponent],
})
export class CustomerListModule {}
