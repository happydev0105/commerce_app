import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatHour'
})
export class FormatHourPipe implements PipeTransform {

  transform(number: number | string): string {
    let value = '';
    if (number === 0 || number === '0') {
      value = '00';
      return value;
    }
    if (number && number.toString().length === 1) {
      value = `0${number.toString()}`;
      return value;
    }
    return '' + number;
  }
}
