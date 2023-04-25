
import { BookingDto } from '../../dto/booking.dto';
import { Commerce } from '../commerce/commerce.model';
import { Customer } from '../customer/customer.model';
import { ReviewVote } from './review-vote.model';

export class Review {

    uuid: string;

    review: string;

    value: number;

    isActive: boolean;

    votes: ReviewVote[];

    booking: BookingDto;

    commerce: Commerce;

    customer: Customer;

    createdAt: string;
}
