import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReviewVote } from '../../models/review/review-vote.model';
import { Review } from '../../models/review/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {


  constructor(private http: HttpClient) { }

  getReviewsByCommerce(commerce: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.api}/review/commerce/${commerce}`);
  }
  getReviewsByBooking(booking: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.api}/review/booking/${booking}`);
  }
  getReviewsByCustomer(customer: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.api}/review/customer/${customer}`);
  }
  saveReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${environment.api}/review/`, review);
  }

  getReviewById(uuid: string): Observable<Review> {
    return this.http.get<Review>(`${environment.api}/review/${uuid}`);
  }

  saveVote(vote: ReviewVote): Observable<ReviewVote> {
    return this.http.post<ReviewVote>(`${environment.api}review-votes/`, vote);
  }
}
