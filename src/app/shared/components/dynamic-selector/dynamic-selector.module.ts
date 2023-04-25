import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicSelectorComponent } from './dynamic-selector.component';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';



@NgModule({
  declarations: [DynamicSelectorComponent],
  exports: [DynamicSelectorComponent],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule
  ]
})
export class DynamicSelectorModule { }
