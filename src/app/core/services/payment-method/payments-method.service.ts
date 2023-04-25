import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentMethodDto } from '../../dto/payment-method.dto';
import { DeleteResult } from '../../interfaces/delete-results.interface';
import { PaymentMethod } from '../../models/payments-method/payment-method.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentsMethodService {

  private apiUrl = environment.api;

  constructor(private http: HttpClient) { }

  findPaymentMethodByCommerce(commerce: string): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.apiUrl}/payments-methods/commerce/${commerce}`);
  }


  createMethod(dto: PaymentMethodDto): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.apiUrl}/payments-methods`, dto);
  }

  deleteMethod(uuid: string): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`${this.apiUrl}/payments-methods/${uuid}`);
  }
}
