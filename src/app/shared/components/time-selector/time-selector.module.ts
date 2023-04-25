import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { TimeSelectorComponent } from './time-selector.component';

@NgModule({
  declarations: [TimeSelectorComponent],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule
  ],
  exports: [TimeSelectorComponent],
})
export class TimeSelectorModule {}
