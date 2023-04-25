import { Employee } from '../models/employee/employee.model';

export class NonAvailabilityDto {
  uuid: string;
  date: string;
  timetable: string;
  message: string;
  employee: Employee;
  week: number;
  commerce: string;
  groupBy: string;
}
