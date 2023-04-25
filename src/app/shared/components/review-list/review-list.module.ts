import { StarRatingModule } from 'angular-star-rating';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewListComponent } from './review-list.component';
import { IonicModule } from '@ionic/angular';
import { NoDataModule } from '../no-data/no-data.module';
import { ReviewCardModule } from '../review-card/review-card.module';



@NgModule({
  declarations: [ReviewListComponent],
  imports: [
    CommonModule,
    IonicModule,
    NoDataModule,
    StarRatingModule,
    ReviewCardModule
  ],
  exports: [ReviewListComponent]
})
export class ReviewListModule { }
