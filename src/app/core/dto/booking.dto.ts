import { Customer } from '../models/customer/customer.model';
import { Employee } from '../models/employee/employee.model';
import { PaymentDto } from '../models/payments/payments.model';
import { Service } from '../models/service.model';

export class BookingDto {
  uuid: string;
  commerce: string;
  customer: Customer;
  week: number;
  startsDay: string;
  startsHour: number;
  startsMinute: number;
  payment: PaymentDto;
  paymentSettedUuid: string;
  commerceSettedUuid: string;
  duration: number;
  service: Service[];
  message: string;
  note: string;
  asignedTo: Employee;
  status: string;
  createdBy: string;
  createdUUID: string;
  createdByType: string;
}
