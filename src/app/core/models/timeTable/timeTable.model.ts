import { Commerce } from '../commerce/commerce.model';
import { Employee } from '../employee/employee.model';

export class TimeTable {
  uuid: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  employee?: Employee;
  commerce?: Commerce;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
