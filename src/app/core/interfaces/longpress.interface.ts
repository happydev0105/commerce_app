import { Time } from '@angular/common';
import { DayModel } from '../models/day.model';
import { Employee } from '../models/employee/employee.model';

export interface Longpress {
  selectedDay: DayModel;
  selectedHour: Time;
  employee?: Employee;
}
