import { NoDataModule } from './../../../shared/components/no-data/no-data.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingPageRoutingModule } from './training-routing.module';

import { TrainingPage } from './training.page';
import { VideoPlayerCardModule } from 'src/app/shared/components/video-player-card/video-player-card.module';
import { VideoPlayerModule } from 'src/app/shared/components/video-player/video-player.module';
import { HeaderModule } from 'src/app/shared/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingPageRoutingModule,
    VideoPlayerModule,
    VideoPlayerCardModule,
    HeaderModule,
    NoDataModule
  ],
  declarations: [TrainingPage]
})
export class TrainingPageModule { }
