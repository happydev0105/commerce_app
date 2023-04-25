import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeCharForAsterisk'
})
export class ChangeCharForAsteriskPipe implements PipeTransform {

  transform(value: string, charsToHide: number): string {
    if (value) {
      let newValue = '';
      const showValue = value.substring(charsToHide); // 2222
      for (let i = 0; i < (value.length - showValue.length); i++) {
        newValue += '*';
      }
      const hideValue = newValue + showValue;
      return hideValue;
    }
    return value;
  }

}
