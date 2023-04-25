import { environment } from 'src/environments/environment';
import { Booking } from 'src/app/core/models/reservation.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentDto } from '../../models/payments/payments.model';
import { CommerceReceiptDto } from '../../interfaces/commerce-receipt.interface';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  apiUrl = environment.api;

  constructor(private http: HttpClient) { }

  getCommerceBillingFromPaymentByWeek(commerce: string, week: number, year: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/billing/calculateFromPaymentByWeek?commerce=${commerce}&week=${week}&year=${year}`);
  }

  getCommerceBillingFromPaymentByDay(commerce: string, day: string): Observable<[PaymentDto[], number]> {
    return this.http.get<[PaymentDto[], number]>(`${this.apiUrl}/billing/calculateFromPaymentByDay?commerce=${commerce}&day=${day}`);
  }

  getCommerceBillingBetweenDates(commerce: string, range: { start: string; end: string }): Observable<PaymentDto[]> {
    return this.http.get<PaymentDto[]>
      (`${this.apiUrl}/billing/calculateBetween?commerce=${commerce}&start=${range.start}&end=${range.end}`);
  }

  getBillingMonthlyByCommerce(commerce: string): Observable<CommerceReceiptDto> {
    return this.http.get<CommerceReceiptDto>(`${this.apiUrl}/billing/getBillingMonthlyByCommerce?commerce=${commerce}`);
  }
}
