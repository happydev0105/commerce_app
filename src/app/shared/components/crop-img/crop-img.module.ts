import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropImgComponent } from './crop-img.component';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from '../../header/header.module';


@NgModule({
  declarations: [CropImgComponent],
  exports: [CropImgComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImageCropperModule,
    FormsModule,
    HeaderModule
  ]
})
export class CropImgModule { }
