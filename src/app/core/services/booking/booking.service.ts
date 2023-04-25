import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BookingDto } from '../../dto/booking.dto';
import { SmsDto } from '../../dto/sms.dto';
import { WeeklyBookings } from '../../dto/weekly-bookings.dto';
import { IBooking } from '../../interfaces/booking.interface';
import { Employee } from '../../models/employee/employee.model';
import { Booking } from '../../models/reservation.model';
import { Service } from '../../models/service.model';
import { BookingTransformer } from '../../transformers/booking.transformer';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = environment.api;

  constructor(private http: HttpClient) { }

  getAvailabilityPerEmployee(
    date: string,
    hour: number,
    minute: number,
    employee: Employee,
    servicesDuration: number,
    serviceCollection: Service[],
    booking?: string,
  ): Observable<boolean> {
    return this.http.post<boolean>(`${environment.api}/availability/employee`,
      { date, hour, minute, employee, servicesDuration, serviceCollection, booking });
  }

  findAllBookingByDay(commerce: string, date: string): Observable<Booking[]> {
    return this.http
      .get<IBooking[]>(`${this.apiUrl}/booking/findByDate`, {
        params: {
          commerce,
          date,
        },
      })
      .pipe(map((item) => BookingTransformer.from(item)));
  }

  findAllBookingByWeek(commerce: string, week: number): Observable<WeeklyBookings> {
    return this.http
      .get<WeeklyBookings>(`${this.apiUrl}/booking/findByWeek`, {
        params: {
          commerce,
          week
        }
      });

  }

  findBookingById(booking: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/booking/${booking}`);
  }

  findBookingsByCommerceAndCustomer(commerce: string, customer: string): Observable<IBooking[]> {
    return this.http.get<IBooking[]>(`${this.apiUrl}/booking/findBookingsByCommerce/${commerce}/customer/${customer}`);

  }


  findLastBookingByCommerceAndCustomer(commerce: string, customer: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/booking/findLastBookingByCommerce/${commerce}/customer/${customer}`);
  }
  findDeletedBookingByCommerceAndCustomer(commerce: string, customer: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/booking/findDeletedBookingByCommerce/${commerce}/customer/${customer}`);
  }
  findNonAttendedBookingByCommerceAndCustomer(commerce: string, customer: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/booking/findNonAttendedBookingByCommerce/${commerce}/customer/${customer}`);
  }
  saveBooking(booking: BookingDto): Observable<IBooking> {
    const commerceId = JSON.parse(
      localStorage.getItem('currentUser')
    ).commerce;
    booking.commerceSettedUuid = commerceId;
    if (booking.commerce === '' || booking.commerce === null || booking.commerce === undefined) {

      if (commerceId) {
        booking.commerce = commerceId;
        booking.commerceSettedUuid = commerceId;
        return this.http.post<IBooking>(`${this.apiUrl}/booking`, booking);
      } else {
        throw new Error('Error de relacion con comercio');

      }
    }
    return this.http.post<IBooking>(`${this.apiUrl}/booking`, booking);
  }
  updateBooking(booking: BookingDto): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/booking`, booking);
  }
  updateBookingPayment(booking: BookingDto): Observable<IBooking> {
    return this.http.patch<IBooking>(`${this.apiUrl}/booking/payment`, booking);
  }
  deleteBookingById(booking: string): Observable<Booking> {
    return this.http.delete<Booking>(`${this.apiUrl}/booking/${booking}`);
  }

  sendBookingNotification(smsDto: SmsDto): Observable<any> {
    return this.http.post<IBooking>(`${this.apiUrl}/booking/sms-notification`, smsDto);
  }
}
