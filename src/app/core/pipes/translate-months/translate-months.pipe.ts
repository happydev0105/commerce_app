import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateMonths'
})
export class TranslateMonthsPipe implements PipeTransform {

  transform(value: string): string {
    const monthsTranslated = {
      january: 'enero',
      february: 'febrero',
      march: 'marzo',
      april: 'abril',
      may: 'mayo',
      june: 'junio',
      july: 'julio',
      august: 'agosto',
      september: 'septiembre',
      october: 'octubre',
      november: 'noviembre',
      december: 'diciembre'
    };
    return monthsTranslated[value] || value;
  }

}
