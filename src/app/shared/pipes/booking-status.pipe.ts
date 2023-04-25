import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bookingStatus'
})
export class BookingStatusPipe implements PipeTransform {

  transform(value: string): string {
    value = value.toLowerCase();
    let returnValue = '';
    if (value === 'pending') {
      return returnValue = 'pendiente';
    }
    return value;
  }

}
