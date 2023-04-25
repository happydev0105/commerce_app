import { catchError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Customer } from '../../models/customer/customer.model';
import { YeasyHttpResponse } from '../../models/http.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) { }

  getAllCustomer(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.api}/customer`);
  }
  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${environment.api}/customer/${id}`);
  }

  getCustomerByEmail(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${environment.api}/customer/email/${id}`);
  }


  getAllCustomerByCommerce(commerceId: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.api}/customer/commerce/${commerceId}`);
  }

  getAllCustomerByCommerceAndCreatedBy(commerce: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.api}/customer/commerceAndCreatedBy/${commerce}`);
  }

  getCustomersByRecentFilter(commerceId: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      `${environment.api}/customer/filter/recent/${commerceId}`
    );
  }

  getCustomersByLoyaltyFilter(commerceId: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      `${environment.api}/customer/filter/loyal/${commerceId}`
    );
  }

  getCustomersByNonAttendantFilter(commerceId: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      `${environment.api}/customer/filter/non-attendant/${commerceId}`
    );
  }

  getWalkinCustomer(): Observable<Customer> {
    return this.http.get<Customer>(
      `${environment.api}/customer/walkin/walkin`
    );
  }

  saveCustomer(customer: Customer): Observable<any> {
    return this.http.post<Customer>(`${environment.api}/customer`, customer).pipe(catchError(err => {
      console.log({ err });
      return of(err);
    }));
  }

  updateCustomer(customer: Customer) {
    return this.http.put(`${environment.api}/customer`, customer);
  }

  deleteCustomer(customer: Customer): Observable<YeasyHttpResponse> {
    return this.http.delete<YeasyHttpResponse>(`${environment.api}/customer/${customer.uuid}`);
  }
}
