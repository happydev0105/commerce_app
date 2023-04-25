import { Position } from '../interfaces/position.interface';
import { Customer } from './customer/customer.model';
import { Employee } from './employee/employee.model';
import { PaymentDto } from './payments/payments.model';
import { Service } from './service.model';
import { Size } from './size.model';

export class Booking {
  uuid: string;
  commerce: string;
  customer: Customer;
  week: number;
  startsDay: string;
  startsHour: number;
  startsMinute: number;
  duration: number;
  service: Service[];
  payment: PaymentDto;
  message: string;
  note: string;
  asignedTo: Employee;
  status: string;
  paymentSettedUuid: string;
  commerceSettedUuid: string;
  mobilePosition: Position;
  mobileSize: Size;
  isDouble: boolean;
  isMultiple?: boolean;
  multipleMinWidth?: number;
  sharePosition?: Booking[];
  isBooking: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdUUID: string;
  createdByType: string;
  isGhost?: boolean;
  isFreetime?: boolean;
  isOverlapped?: boolean;
  overlapCount: number
}
