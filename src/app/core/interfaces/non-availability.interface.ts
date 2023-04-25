import { Employee } from '../models/employee/employee.model';

export interface INonAvailability {
  uuid: string;
  date: string;
  week: number;
  timetable: string;
  employee: Employee;
  message: string;
  commerce: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  groupBy?: string;
}
