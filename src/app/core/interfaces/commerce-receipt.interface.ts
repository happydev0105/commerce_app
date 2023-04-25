import { Employee } from 'src/app/core/models/employee/employee.model';
import { Commerce } from '../models/commerce/commerce.model';
import { Subscription } from '../models/subscription/subscription.model';

export interface CommerceReceiptDto {
  commerce: Commerce;
  owner: Employee;
  subscription: Subscription;
}
