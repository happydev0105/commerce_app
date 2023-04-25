import { NavController } from '@ionic/angular';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from 'src/app/core/models/customer/customer.model';
import { ReviewVote } from 'src/app/core/models/review/review-vote.model';
import { Review } from 'src/app/core/models/review/review.model';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewCardComponent implements OnChanges {
  @Input() review: Review;
  @Input() showShare: boolean = true;
  @Output() reportEmmitter: EventEmitter<Review> = new EventEmitter<Review>();

  public ratingValue: number;
  public positiveValue: number;
  public negativeValue: number;

  constructor(private navCtrl: NavController) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.review.currentValue !== null) {

      this.calcVotes(changes.review.currentValue.vote);
    }
  }

  isOwner(customerReviewUuid: string, loggedUserUuid: string): boolean {
    return customerReviewUuid === loggedUserUuid;
  }

  calcVotes(votes: ReviewVote[]) {

    this.positiveValue = votes.filter((item: ReviewVote) => item.type === 'positive').length;
    this.negativeValue = votes.length - this.positiveValue;
  }



  reportEmit(review: Review) {
    this.reportEmmitter.emit(review);
  }

  goToMarketing(review: Review) {
    // Pillar otra imagen para reseñas
    const selectedItem = { title: review.review, image: '/assets/images/salon3.jpg' };
    this.navCtrl.navigateForward(['tabs/profile/marketing'], { state: { selectedItem, review } });
  }


}
