import { Customer } from '../customer/customer.model';
import { PaymentDto } from '../payments/payments.model';
import { Product } from '../product/product.model';
import { Booking } from '../reservation.model';
import { Review } from '../review/review.model';
import { Service } from '../service.model';
import { Subscription } from '../subscription/subscription.model';
import { Ticket } from '../ticket/ticket.model';
import { TimeTable } from '../timeTable/timeTable.model';


export class Commerce {
    uuid: string;
    name: string;
    type: string;
    email: string;
    slug: string;
    nif: string;
    description: string;
    city: string;
    province: string;
    municipality: string;
    address: string;
    postCode: string;
    lat: string;
    long: string;
    phone: string;
    logo: string;
    featureImage: string;
    rating: number;
    website: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    product: Product[];
    services: Service[];
    booking: Booking[];
    customer: Customer[];
    payments: PaymentDto[];
    reviews: Review[];
    smsAvailable: number;
    smsSent: number;
    subscription: Subscription;
    tickets: Ticket[];
    timetable: TimeTable;
    bannedCustomers: Customer[];
}
