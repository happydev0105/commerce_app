import { IRangeTimeTable } from './rangeTimetable.interface';
export interface ScheduleDay {
  uuid?: string;
  monday: IRangeTimeTable;
  tuesday: IRangeTimeTable;
  wednesday: IRangeTimeTable;
  thursday: IRangeTimeTable;
  friday: IRangeTimeTable;
  saturday: IRangeTimeTable;
  sunday: IRangeTimeTable;
}
