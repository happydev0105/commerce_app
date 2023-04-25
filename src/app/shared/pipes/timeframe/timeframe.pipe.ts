import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeframe'
})
export class TimeframePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(value.substring(3,value.length) !== '00'){
 return value.slice(3);
    }
   return value;
  }

}
