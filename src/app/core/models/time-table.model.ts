import { Employee } from './employee/employee.model';
import { NonAvailability } from './non-availability.model';
import { Booking } from './reservation.model';
import {TimeTable as TimetableCommerce} from '../models/timeTable/timeTable.model';
import { IRangeTimeTable } from '../interfaces/rangeTimetable.interface';
import { FrameLabel } from '../interfaces/frame.label.interface';

export class TimeTable {
  week: number;
  timeFrames: FrameLabel[];
  employees: Employee[];
  bookings: Booking[];
  freeTime: Booking[];
  day: string;
  nonAvailability: NonAvailability[];
  startOverTime: number;
  endOverTime: number;
  indexWeekDay: number;
  columnWidth: number;
  tableWidth: string;
  draggableWidth: string;

  commerceTimeTable: IRangeTimeTable;
}
