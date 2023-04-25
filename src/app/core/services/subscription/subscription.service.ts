import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from '../../models/subscription/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  apiUrl = environment.api;

  constructor(private http: HttpClient) { }

  getByCommerce(commerceId: string): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/subscription/commerce/${commerceId}`);
  }

  updateSubscription(subscription: Subscription): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/subscription`, subscription);
  }

  cancelSubscription(commerceId: string){
    return this.http.post<Subscription>(`${this.apiUrl}/subscription/cancel`, commerceId);
  }
}
