import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateDays'
})
export class TranslateDaysPipe implements PipeTransform {

  transform(value: string): string {
    const daysTranslated = {
      monday: 'lunes',
      tuesday: 'martes',
      wednesday: 'miércoles',
      thursday: 'jueves',
      friday: 'viernes',
      saturday: 'sábado',
      sunday: 'domingo'
    };
    return daysTranslated[value] || value;
  }

}
