import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingVideoPageRoutingModule } from './training-video-routing.module';

import { TrainingVideoPage } from './training-video.page';
import { VideoPlayerModule } from 'src/app/shared/components/video-player/video-player.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingVideoPageRoutingModule,
    VideoPlayerModule,
    HeaderModule
  ],
  declarations: [TrainingVideoPage]
})
export class TrainingVideoPageModule { }
