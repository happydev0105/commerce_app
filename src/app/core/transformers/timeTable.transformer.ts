/* eslint-disable radix */
import { IRangeTimeTable } from 'src/app/core/interfaces/rangeTimetable.interface';
import { OpeningHours } from 'src/app/pages/profile/admin-employee/employee-detail/employee-detail.page';
import { ScheduleDay } from '../interfaces/schedule-day.interface';
import { TimeTable } from '../models/timeTable/timeTable.model';

export class TimeTableTransformer {
  public static to(
    checkinTime: string,
    departureTime: string,
    restStart: string = null,
    restEnd: string = null): string {
    const checkinTimeSplitted = checkinTime.split(':');
      const departureTimeSplitted = departureTime.split(':');
      const checkinHour = checkinTimeSplitted[0]; const checkinMinutes = checkinTimeSplitted[1];
      const departureHour = departureTimeSplitted[0]; const departureMinutes = departureTimeSplitted[1];
    const rangeTimeTable: IRangeTimeTable = {
      start: {
        hour: Number.parseInt(checkinHour),
        minute: Number.parseInt(checkinMinutes)
      },
      end: {
        hour: Number.parseInt(departureHour),
        minute: Number.parseInt(departureMinutes)
      }
    };

    if (restStart && restEnd) {
      const restStartSplitted = restStart.split(':');
        const restEndSplitted = restEnd.split(':');
        const restStartHour = restStartSplitted[0]; const restStartMinute = restStartSplitted[1];
        const restEndHour = restEndSplitted[0]; const restEndMinute = restEndSplitted[1];
      rangeTimeTable.rest = {
        start: {
          hour: Number.parseInt(restStartHour),
          minute: Number.parseInt(restStartMinute)
        },
        end: {
          hour: Number.parseInt(restEndHour),
          minute: Number.parseInt(restEndMinute)
        }
      };
    }
    return JSON.stringify(rangeTimeTable);
  }

  public static toRangeTable(timeTable: TimeTable): ScheduleDay {
    const time = {
      monday: timeTable.monday,
      tuesday: timeTable.tuesday,
      wednesday: timeTable.wednesday,
      thursday: timeTable.thursday,
      friday: timeTable.friday,
      saturday: timeTable.saturday,
      sunday: timeTable.sunday
    };
    const scheduleDay: ScheduleDay = {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null
    };
    for (const prop in time) {
      scheduleDay[prop] = JSON.parse(time[prop]);
    }
    return scheduleDay;
  }

  public static from(timeTable: TimeTable): TimeTable {
    const transformStringValue = (parsedDay: IRangeTimeTable): string => {
      const padZero = (hour: number): string | number => {
        if (hour < 10) {return '0' + hour;}
        return hour;
      };
      let dayStringValue = '';
      dayStringValue += parsedDay.start.hour + ':';
      if (parsedDay.start.minute === 0) {
        dayStringValue += '00-';
      } else {
        dayStringValue += parsedDay.start.minute + '-';
      }
      dayStringValue += parsedDay.end.hour + ':';
      if (parsedDay.end.minute === 0) {
        dayStringValue += '00';
      } else {
        dayStringValue += parsedDay.end.minute + '';
      }
      // Refactorizar con padZero
      return dayStringValue;
    };

    const mondayParsed: IRangeTimeTable = JSON.parse(timeTable.monday);
      const tuesdayParsed: IRangeTimeTable = JSON.parse(timeTable.tuesday);
      const wednesdayParsed: IRangeTimeTable = JSON.parse(timeTable.wednesday);
      const thursdayParsed: IRangeTimeTable = JSON.parse(timeTable.thursday);
      const fridayParsed: IRangeTimeTable = JSON.parse(timeTable.friday);
      const saturdayParsed: IRangeTimeTable = JSON.parse(timeTable.saturday);
      const sundayParsed: IRangeTimeTable = JSON.parse(timeTable.sunday);

    timeTable.monday = transformStringValue(mondayParsed);
    timeTable.tuesday = transformStringValue(tuesdayParsed);
    timeTable.wednesday = transformStringValue(wednesdayParsed);
    timeTable.thursday = transformStringValue(thursdayParsed);
    timeTable.friday = transformStringValue(fridayParsed);
    timeTable.saturday = transformStringValue(saturdayParsed);
    timeTable.sunday = transformStringValue(sundayParsed);

    return timeTable;
  }

  public static compareBetweenCommerceAndEmployee(timeTableCollection: TimeTable[]): TimeTable {
    const employeeTimeTable = timeTableCollection[0];
      const commerceTimeTable = timeTableCollection[1];

    if (!JSON.parse(commerceTimeTable.monday).start.hour) {
      JSON.parse(employeeTimeTable.monday).start.hour = null;
      JSON.parse(employeeTimeTable.monday).end.hour = null;
    }
    if (!JSON.parse(commerceTimeTable.tuesday).start.hour) {
      JSON.parse(employeeTimeTable.tuesday).start.hour = null;
      JSON.parse(employeeTimeTable.tuesday).end.hour = null;
    }
    if (!JSON.parse(commerceTimeTable.wednesday).start.hour) {
      JSON.parse(employeeTimeTable.wednesday).start.hour = null;
      JSON.parse(employeeTimeTable.wednesday).end.hour = null;
    }
    if (!JSON.parse(commerceTimeTable.thursday).start.hour) {
      JSON.parse(employeeTimeTable.thursday).start.hour = null;
      JSON.parse(employeeTimeTable.thursday).end.hour = null;
    }
    if (!JSON.parse(commerceTimeTable.friday).start.hour) {
      JSON.parse(employeeTimeTable.friday).start.hour = null;
      JSON.parse(employeeTimeTable.friday).end.hour = null;
    }
    if (!JSON.parse(commerceTimeTable.saturday).start.hour) {
      JSON.parse(employeeTimeTable.saturday).start.hour = null;
      JSON.parse(employeeTimeTable.saturday).end.hour = null;
    }
    if (!JSON.parse(commerceTimeTable.sunday).start.hour) {
      JSON.parse(employeeTimeTable.sunday).start.hour = null;
      JSON.parse(employeeTimeTable.sunday).end.hour = null;
    }
    return employeeTimeTable;
  }

  public static restrictHours(commerceTimeTable: TimeTable): OpeningHours {
    const getSchedule = (day: string) => {
      const daySplitted = day.split('-');
        const startHour = Number.parseInt(daySplitted[0]);
        const endHour = Number.parseInt(daySplitted[1]);
      //const dayParsed = JSON.parse(day);
      const hours: string[] = [];
      for (let i = startHour; i <= endHour; i++) {
        if (i) {
          hours.push(i.toString());
          if (i === startHour) {
            hours[0] = `${i.toString()}:${daySplitted[0].split(':')[1]}`;
          }
          if (i === endHour) {
            hours[hours.length - 1] = `${i.toString()}:${daySplitted[1].split(':')[1]}`;
          }
        }
      }
      return hours;
    };

    const getHours = (checkinHour: number, departureHour: number): string[] => {
      const hours: string[] = [];
      for (let i = checkinHour; i <= departureHour; i++) {
        if (i)
          {hours.push(i.toString());}
      }
      return hours;
    };

    const openingHours: OpeningHours = {
      monday: getSchedule(commerceTimeTable.monday),
      tuesday: getSchedule(commerceTimeTable.tuesday),
      wednesday: getSchedule(commerceTimeTable.wednesday),
      thursday: getSchedule(commerceTimeTable.thursday),
      friday: getSchedule(commerceTimeTable.friday),
      saturday: getSchedule(commerceTimeTable.saturday),
      sunday: getSchedule(commerceTimeTable.sunday)
    };
    return openingHours;
  }

  public static createCloseDay(): string {
    const closeDay: IRangeTimeTable = {
      start: {
        hour: null,
        minute: null
      },
      end: {
        hour: null,
        minute: null
      }
    };
    return JSON.stringify(closeDay);
  }
}
