import { Review } from 'src/app/core/models/review/review.model';
import { Component, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ReviewService } from 'src/app/core/services/review/review.service';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
})
export class ReviewListComponent implements OnDestroy {

  commerceLogged: string;
  reviewCollection: Review[];
  subscription: Subscription = new Subscription();

  constructor(private modalCtrl: ModalController, private reviewService: ReviewService) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
  }


  ionViewWillEnter() {
    this.getReviewsByCommerce(this.commerceLogged);
  }
  getReviewsByCommerce(customer: string) {
    this.subscription.add(this.reviewService.getReviewsByCommerce(customer).subscribe((res: Review[]) => {
      this.reviewCollection = [...res];
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectReview(review: Review) {
    this.modalCtrl.dismiss({ review});
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
