import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateSelectorComponent } from './date-selector.component';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';



@NgModule({
  declarations: [DateSelectorComponent],
  exports: [DateSelectorComponent],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule
  ]
})
export class DateSelectorModule { }
