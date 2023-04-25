import { StaticGalleryComponent } from './static-gallery.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NoDataModule } from '../no-data/no-data.module';



@NgModule({
  declarations: [StaticGalleryComponent],
  imports: [
    CommonModule,
    IonicModule,
    NoDataModule
  ],
  exports: [StaticGalleryComponent]
})
export class StaticGalleryModule { }
