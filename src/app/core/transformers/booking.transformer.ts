import { addMinutes, isPast } from 'date-fns';
import { IBooking } from '../interfaces/booking.interface';
import { Booking } from '../models/reservation.model';

export class BookingTransformer {
  public static from(dto: IBooking[]): Booking[] {
    const newBookingCollection: Booking[] = [];
    dto.forEach((item: IBooking) => {
      const newBook: Booking = new Booking();
      newBook.asignedTo = item.asignedTo;
      newBook.commerce = item.commerce;
      newBook.customer = item.customer;
      newBook.duration = item.duration;
      newBook.isBooking = item.isBooking;
      newBook.payment = item.payment;
      newBook.mobilePosition = {
        x: 0,
        y: 0,
        id: item.uuid
      };
      newBook.mobileSize = {
        width: 2,
        height: 2,
      };
      newBook.service = item.service;
      newBook.startsDay = item.startsDay;
      newBook.startsHour = item.startsHour;
      newBook.startsMinute = item.startsMinute;
      newBook.status = this.setStatus(item);
      newBook.uuid = item.uuid;
      newBook.week = item.week;
      newBook.message = item.message;
      newBook.note = item.note;
      newBookingCollection.push(newBook);
    });
    return newBookingCollection;
  }

  private static setStatus(booking: IBooking): string {
    const splittedDate: string[] = booking.startsDay.split('-');
    const year = parseInt(splittedDate[0], 10);
    const month = parseInt(splittedDate[1], 10) - 1;
    const day = parseInt(splittedDate[2], 10);
    const date = new Date(year, month, day, booking.startsHour, booking.startsMinute);
    const reservationEndDate = addMinutes(date, booking.duration);
    if (booking.status === 'Realizada') {
      return 'Realizada';
    }
    if (booking.status === 'No asistida') {
      return 'No asistida';
    }
    return isPast(reservationEndDate) && booking.payment === null ? 'Pendiente de pago' : 'Pendiente';
  }
}
