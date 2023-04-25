import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  addMinutes,
  format,
  getHours,
  getMinutes,
  getWeek,
  subMinutes,
} from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class DateService {

  public addZeroToMinutesAndHours(hourString: string): string {
    const hourSplitted: string[] = hourString.split(':');
    let hours = hourSplitted[0]; let minutes = hourSplitted[1];
    if (hours.length < 2) {
      hours = `0${hours}`;
    }
    if (minutes.length < 2) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes}`;
  }

  public addZeroToMinutes(str: string): string {
    const strSplitted: string[] = str.split(':');
    const minutes = strSplitted[1];
    if (minutes.length < 2 && minutes !== '5') {
      return str + '0';
    }
    if (minutes.length < 2 && minutes === '5') {
      return strSplitted[0] + ':' + '0' + minutes;
    }
    return str;
  }

  public formatBookingTimetable(
    startHour: number,
    startMinute: number,
    duration: number
  ): string {
    const newDate = new Date(2022, 1, 1, startHour, startMinute);
    const endDate = addMinutes(newDate, duration);
    const ending: string = this.addZeroToMinutes(
      getHours(endDate) + ':' + getMinutes(endDate)
    );

    const starting: string =
      getHours(subMinutes(endDate, duration)) +
      ':' +
      getMinutes(subMinutes(endDate, duration));
    return this.addZeroToMinutes(starting) + '-' + ending;
  }

  public formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  public getWeekNumberByDate(date: Date): number {
    return getWeek(date, {
      weekStartsOn: 1,
      firstWeekContainsDate: 4,
    });
  }

  public getHoursAndMinuteFromDate(date: Date): string {
    const hour = getHours(date);
    const minute = getMinutes(date);
    return hour + ':' + minute;
  }

  formatDateLanguage(date: string, locale): string {
    if (date) {
      const datefor = format(new Date(date), 'dd MMM yyyy', { locale });
      return datefor;
    }

  }
}
