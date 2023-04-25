import { Customer } from '../models/customer/customer.model';
import { Employee } from '../models/employee/employee.model';
import { PaymentsMethod } from '../models/payments/payments-methods.model';
import { PaymentProduct } from '../models/payments-product/payments-product.model';
import { Product } from '../models/product/product.model';
import { Booking } from '../models/reservation.model';
import { Service } from '../models/service.model';
import { PaymentService } from '../models/payments-service/payments-service.model';

export interface IPayment {
  uuid: string;
  date: string;
  amount: number;
  decimals: number;
  service: Service[];
  product: Product[];
  booking?: Booking;
  bookingSettedUuid: string;
  week: number;
  discount: number;
  commerce: string;
  customer: Customer;
  employee: Employee;
  paymentProducts: PaymentProduct[];
  paymentServices: PaymentService[];
  method: PaymentsMethod;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}
