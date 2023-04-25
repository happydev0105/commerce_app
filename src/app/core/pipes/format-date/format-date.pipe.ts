import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: string): string {
    let returnValue = '';
    const actualDate = new Date(value),
      day = actualDate.getDate(),
      month = actualDate.getMonth(),
      monthFormatted = month.toString().length === 1 ? `0${month}` : month,
      year = actualDate.getFullYear(),
      monthString = actualDate.toLocaleString('default', { month: 'long' }),
      actualDateFormatted = `${year}-${monthFormatted}-${day}`;
    returnValue = `${value.split('-')[2]} ${monthString} ${year}`;
    if (value === actualDateFormatted) {
      returnValue = 'Hoy';
    }
    return returnValue;
  }
}
