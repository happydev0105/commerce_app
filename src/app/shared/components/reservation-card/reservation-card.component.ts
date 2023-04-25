import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { addMinutes, getHours, getMinutes } from 'date-fns';
import { Booking } from 'src/app/core/models/reservation.model';

@Component({
  selector: 'app-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss'],
})
export class ReservationCardComponent {
  @Input() reservation: Booking;
  @Input() rowspan: number;

  constructor(public sanitizer: DomSanitizer) {}

  calc(duration: number): string {
    const height = ((duration / 15) * 100) / this.rowspan;
    return height + '%';
  }

  addZeroToMinutes(str: string): string {
    const strSplitted: string[] = str.split(':');
    const minutes = strSplitted[1];
    if (minutes.length < 2) {
      return str + '0';
    }
    return str;
  }

  formatBookingTimetable(booking: Booking): string {
    const newDate = new Date(
      2022,
      1,
      1,
      booking.startsHour,
      booking.startsMinute
    );
    const endDate = addMinutes(newDate, booking.duration);
    const starting: string = this.addZeroToMinutes(
      booking.startsHour + ':' + booking.startsMinute
    );
    const ending: string = this.addZeroToMinutes(
      getHours(endDate) + ':' + getMinutes(endDate)
    );
    return starting + '-' + ending;
  }
}
