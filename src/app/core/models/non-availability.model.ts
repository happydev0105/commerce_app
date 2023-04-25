import { Position } from '../interfaces/position.interface';
import { Employee } from './employee/employee.model';
import { Size } from './size.model';

export class NonAvailability {
  uuid?: string;

  date: string;

  timetable: string;

  employee: Employee;

  commerce: string;

  message: string;

  mobilePosition: Position;

  mobileSize: Size;

  duration: number;

  startHour: number;

  startMinute: number;

  type: string;
}
