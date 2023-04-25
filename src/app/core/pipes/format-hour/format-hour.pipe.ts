import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatHour'
})
export class FormatHourPipe implements PipeTransform {

  transform(hour: string | number): string {
    if (hour === null || hour === undefined || hour === '') { return '';};
    let value = '';
    if (hour === 0 || hour === '0') {
      value = '00';
      return value;
    }
    if (hour && hour.toString().length === 1) {
      value = `0${hour.toString()}`;
      return value;
    }
    return '' + hour;
  }

}
