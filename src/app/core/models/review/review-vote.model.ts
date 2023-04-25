import { Customer } from '../customer/customer.model';
import { Review } from './review.model';

export class ReviewVote {
    uuid?: string;
    type: string;
    review: Review;
    customer: Customer;
}
