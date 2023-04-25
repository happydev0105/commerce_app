import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommerceInfoPageRoutingModule } from './commerce-info-routing.module';

import { CommerceInfoPage } from './commerce-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommerceInfoPageRoutingModule,
    HeaderModule
  ],
  declarations: [CommerceInfoPage]
})
export class CommerceInfoPageModule { }
