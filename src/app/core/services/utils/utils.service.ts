import { ScheduleDay } from 'src/app/core/interfaces/schedule-day.interface';
import { Injectable } from '@angular/core';
import { add, addDays, eachWeekOfInterval, format, startOfWeek, startOfYear } from 'date-fns';
import { es } from 'date-fns/locale';
import { Commerce } from '../../models/commerce/commerce.model';
import { Employee } from '../../models/employee/employee.model';
import { TimeTableTransformer } from '../../transformers/timeTable.transformer';
import { CommerceService } from '../commerce/commerce.service';
import { Selector } from '../../models/selector.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private commerceService: CommerceService) { }

  calculateToday(): string {
    const actualDate = new Date();
    const day = actualDate.getDate();
    const month = actualDate.getMonth() + 1;
    const monthFormatted = month.toString().length === 1 ? `0${month}` : month;
    const dayFormatted = day.toString().length === 1 ? `0${day}` : day;
    const year = actualDate.getFullYear();
    const actualDateFormatted = `${year}-${monthFormatted}-${dayFormatted}`;
    return actualDateFormatted;
  }

  capitalizeFirstLetter(text: string) {
    if (text.length >= 1) {
      const capitalize = text.charAt(0).toUpperCase();
      text = text.replace(text.charAt(0), capitalize);
    }
    return text;
  }

  generateRandomPassword(): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const passwordLength = 12;
    let password = '';
    for (let i = 0; i <= passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  }

  generateRandomFileName(originalFileName: string): string {
    const name = originalFileName.split('.')[0];
    const fileExtName = originalFileName.split('.')[1];
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    return `${name}-${randomName}.${fileExtName}`;
  }

  getAllDaysInMonth(year: number, month: number) {
    const date = new Date(year, month, 1);

    const dates = [];

    while (date.getMonth() === month) {
      const evaluateDay = new Date(date).getDate();
      dates.push({
        text: evaluateDay.toString(),
        value: evaluateDay,
      });
      if ((month === 3 || month === 5 || month === 8 || month === 10) && (evaluateDay === 30)) {
        dates.push({
          text: '31',
          value: 31,
          disabled: true
        });
      }
      if (month === 1 && evaluateDay === 28) {
        dates.push(
          {
            text: '29',
            value: 29,
            disabled: true
          },
          {
            text: '30',
            value: 30,
            disabled: true
          },
          {
            text: '31',
            value: 31,
            disabled: true
          });
      }
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }

  getAllWeeks(year: number) {
    const weekFormatted = [];
    const nextWeekDate = add(new Date(), { weeks: 1 });
    const startDate = startOfYear(new Date(year, 0, 2));
    const result = eachWeekOfInterval({
      start: startOfWeek(startDate, { weekStartsOn: 1, locale: es }),
      end: nextWeekDate
    });
    result.shift();
    result.forEach((week, index) => {
      if (result[index + 1]) {
        const weekItem = format(addDays(result[index], 1), 'd-MMM', { locale: es }) + ' ' + format(result[index + 1], 'd-MMM', { locale: es });
        weekFormatted.push([weekItem, index + 1]);
      }
    });
    return weekFormatted;
  }


  getAllMonthsInYear() {
    const months =
      ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthCollection = [];

    months.forEach((month, index) => monthCollection.push({
      text: month,
      value: index + 1
    }));
    return monthCollection;
  }

  getYearsFromYeasyInit(): Selector[] {
    const yeasyYearInit = 2022;
    const currentDate = new Date();
    const actualYear = currentDate.getFullYear();
    const differenceYears = actualYear - yeasyYearInit;
    const yearCollection: Selector[] = [];

    if (differenceYears === 0) {
      return [{ text: '2022', value: 2022 }];
    }

    for (let i = 0; i <= differenceYears; i++) {


      yearCollection.push({
        text: (yeasyYearInit + i).toString(),
        value: yeasyYearInit + i,
        isInitial: yeasyYearInit + i === actualYear
      });
    }
    return yearCollection;
  }


  generateHours(start: number | string, end: number | string): string[] {
    const hours: string[] = [];
    if (typeof start === 'string') {
      start = Number.parseInt(start, 10);
    }
    if (typeof end === 'string') {
      end = Number.parseInt(end, 10);
    }
    for (let i = start; i <= end; i++) {
      const hour = i.toString();
      hours.push(hour);
    }
    return hours;
  }

  generateMinutes(): string[] {
    const availableMinutes = 60;
    const minutes: string[] = [];
    for (let i = 0; i < availableMinutes; i += 5) {
      const minute = i.toString();
      minutes.push(minute);
    }
    return minutes;
  }

  transformHourStringIntoMinutes(hour: string): number {
    let duration = 0;
    const hours = Number.parseInt(hour.split(':')[0], 10);
    const minutes = Number.parseInt(hour.split(':')[1], 10);

    duration += (hours * 60) + minutes;
    return duration;
  }

  getTimetableByEmployeeId(employeeId: string, employeeCollection: Employee[]): ScheduleDay {

    if (employeeCollection.length > 0) {
      const timeTable: ScheduleDay =
        TimeTableTransformer.toRangeTable(employeeCollection.find((emp: Employee) => emp.uuid === employeeId)?.timetable);
      return timeTable;
    }

  }
  getTimetableByCommerce(commerce: Commerce): ScheduleDay {
    const timeTable: ScheduleDay = TimeTableTransformer.toRangeTable(commerce.timetable);
    return timeTable;
  }

  getCommerceData(commerceId: string) {
    this.commerceService.getCommerceInfoById(commerceId).subscribe(response => {
      if (response) {
        localStorage.setItem('currentCommerce', JSON.stringify(response));

      }
    });
  }

  /**
 * Convert BASE64 to BLOB
 * @param base64Image Pass Base64 image data to convert into the BLOB
 */
  convertBase64ToBlob(base64Image: string): Blob {
    // Split into two parts
    const parts = base64Image.split(';base64,');

    // Hold the content type
    const imageType = parts[0].split(':')[1];

    // Decode Base64 string
    const decodedData = window.atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }


}
