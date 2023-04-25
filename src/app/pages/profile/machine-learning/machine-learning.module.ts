import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MachineLearningPageRoutingModule } from './machine-learning-routing.module';

import { MachineLearningPage } from './machine-learning.page';
import { HeaderModule } from 'src/app/shared/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MachineLearningPageRoutingModule,
    HeaderModule
  ],
  declarations: [MachineLearningPage]
})
export class MachineLearningPageModule {}
