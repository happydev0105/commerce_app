import { GetImageModule } from './../../core/pipes/get-image/get-image.module';
import { HeaderModule } from './../../shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { CropImgModule } from 'src/app/shared/components/crop-img/crop-img.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    HeaderModule,
    GetImageModule,
    CropImgModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
