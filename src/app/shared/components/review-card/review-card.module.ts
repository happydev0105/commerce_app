import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewCardComponent } from './review-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StarRatingModule } from 'angular-star-rating';


@NgModule({
  declarations: [ReviewCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    StarRatingModule
  ],
  exports: [ReviewCardComponent],

})
export class ReviewCardModule { }
