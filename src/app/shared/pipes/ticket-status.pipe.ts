import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ticketStatus'
})
export class TicketStatusPipe implements PipeTransform {

  transform(value: string): string {
    const translatedStatus = {
      pending: 'pendiente',
      in_progress: 'en progreso',
      finished: 'finalizado'
    };
    return translatedStatus[value];
  }

}
