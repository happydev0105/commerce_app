import { Customer } from '../customer/customer.model';
import { PaymentsMethod } from './payments-methods.model';
import { Product } from '../product/product.model';
import { Booking } from '../reservation.model';
import { Service } from '../service.model';
import { Employee } from '../employee/employee.model';
import { PaymentProduct } from '../payments-product/payments-product.model';
import { PaymentService } from '../payments-service/payments-service.model';

export class PaymentDto {
  uuid: string;
  date: string;
  week: number;
  amount: number;
  decimals: number;
  service: Service[];
  product: Product[];
  booking?: Booking;
  bookingSettedUuid?: string;
  discount: number;
  method: PaymentsMethod;
  commerce: string;
  customer: Customer;
  employee?: Employee;
  paymentProducts: PaymentProduct[];
  paymentServices: PaymentService[];
  isDeleted: boolean;
  createdAt?: string;
}
