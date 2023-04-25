import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPayment } from '../../interfaces/payment.interface';
import { PaymentDto } from '../../models/payments/payments.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private apiUrl = environment.api;

  constructor(private http: HttpClient) {}

  savePaymentByCommerce(paymentDto: PaymentDto): Observable<IPayment> {
    return this.http.post<IPayment>(`${this.apiUrl}/payments/`, paymentDto);
  }

  deletePayment(paymentId: string) {
    return this.http.delete(`${this.apiUrl}/payments/${paymentId}`);
  }

  getPaymentById(paymentId: string): Observable<IPayment> {
    return this.http.get<IPayment>(`${this.apiUrl}/payments/${paymentId}`);
  }

  getPaymentByCommerceCustomer(commerceId: string, customerId:string): Observable<IPayment[]> {
    return this.http.get<IPayment[]>(`${this.apiUrl}/payments/commerce/${commerceId}/customer/${customerId}`);
  }
}
