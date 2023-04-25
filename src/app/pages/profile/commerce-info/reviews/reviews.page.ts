import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Review } from 'src/app/core/models/review/review.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ReviewService } from 'src/app/core/services/review/review.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewsPage implements OnDestroy {
  commerceLogged: string;
  reviewCollection: Review[];
  subscription: Subscription = new Subscription();

  constructor(private reviewService: ReviewService, private router: Router, private authService: AuthService) {
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
}
