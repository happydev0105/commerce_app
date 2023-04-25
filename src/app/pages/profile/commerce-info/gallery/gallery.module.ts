import { GetImageModule } from './../../../../core/pipes/get-image/get-image.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalleryPageRoutingModule } from './gallery-routing.module';

import { GalleryPage } from './gallery.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AlertModule } from 'src/app/shared/components/alert/alert.module';
import { CropImgModule } from 'src/app/shared/components/crop-img/crop-img.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GalleryPageRoutingModule,
    HeaderModule,
    GetImageModule,
    AlertModule,
    CropImgModule
  ],
  declarations: [GalleryPage]
})
export class GalleryPageModule { }
