import { TranslateMonthsPipe } from '../../../core/pipes/translate-months/translate-months.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoPlayerCardComponent } from './video-player-card.component';
import { VideoPlayerModule } from '../video-player/video-player.module';
import { IonicModule } from '@ionic/angular';
import { TranslateMonthsModule } from './../../../core/pipes/translate-months/translate-months.module';



@NgModule({
  declarations: [VideoPlayerCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    VideoPlayerModule,
    TranslateMonthsModule
  ],
  exports: [VideoPlayerCardComponent]
})
export class VideoPlayerCardModule { }
