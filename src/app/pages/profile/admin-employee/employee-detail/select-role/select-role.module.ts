import { HeaderModule } from './../../../../../shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectRolePageRoutingModule } from './select-role-routing.module';

import { SelectRolePage } from './select-role.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SelectRolePageRoutingModule,
    HeaderModule
  ],
  declarations: [SelectRolePage]
})
export class SelectRolePageModule {}
