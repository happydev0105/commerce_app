import { Customer } from '../models/customer/customer.model';
import { Employee } from '../models/employee/employee.model';
import { PaymentDto } from '../models/payments/payments.model';
import { Service } from '../models/service.model';

export interface IBooking {
  uuid: string;
  commerce: string;
  customer: Customer;
  week: number;
  startsDay: string;
  startsHour: number;
  startsMinute: number;
  payment: PaymentDto;
  duration: number;
  service: Service[];
  isBooking: boolean;
  asignedTo: Employee;
  status: string;
  message: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
