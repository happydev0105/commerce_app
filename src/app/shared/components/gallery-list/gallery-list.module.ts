import { GalleryListComponent } from './gallery-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NoDataModule } from '../no-data/no-data.module';
import { GetImageModule } from 'src/app/core/pipes/get-image/get-image.module';



@NgModule({
  declarations: [GalleryListComponent],
  imports: [
    CommonModule,
    IonicModule,
    NoDataModule,
    GetImageModule
  ],
  exports: [GalleryListComponent]
})
export class GalleryListModule { }
