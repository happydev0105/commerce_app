import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {

  transform(value: string|number): string {
    let price = value.toString();
    if (price.includes('.')) {
      const splittedValue = price.split('.');
      if (splittedValue[1].length === 1) {
        price = splittedValue.join('.') + '0';
      }
    }
    return price + '€';
  }

}
