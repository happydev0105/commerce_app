import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewsPageRoutingModule } from './reviews-routing.module';

import { ReviewsPage } from './reviews.page';
import { ReviewCardModule } from 'src/app/shared/components/review-card/review-card.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewsPageRoutingModule,
    ReviewCardModule,
    HeaderModule,
    NoDataModule
  ],
  declarations: [ReviewsPage]
})
export class ReviewsPageModule { }
