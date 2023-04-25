import { PaymentByType } from './../../interfaces/paymentByType.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookingReport } from '../../interfaces/booking-report.interface';
import { Top5CustomersReport } from '../../interfaces/top-five-customer-report.interface';
import { TeamPerformance } from '../../interfaces/team-performance.interface';
import { Top5ProductsReport } from '../../interfaces/top-five-product-report.interface';
import { Top5ServicesReport } from '../../interfaces/top-five-services-report.interface';

@Injectable({
  providedIn: 'root'
})
export class StadisticsService {

  constructor(private http: HttpClient) { }

  getReportFromBookingByDay(commerceId: string, day: string): Observable<BookingReport> {
    return this.http.get<BookingReport>(`${environment.api}/stadistics/bookingReportFromCommerceByDay?commerce=${commerceId}&day=${day}`);
  }

  getTop5CustomersByDay(commerceId: string, day: string): Observable<Top5CustomersReport[]> {
    return this.http.get<Top5CustomersReport[]>(`${environment.api}/stadistics/customerTopFiveFromCommerceByDay?commerce=${commerceId}&day=${day}`);
  }

  getTotalBillingByDay(commerceId: string, day: string): Observable<any> {
    return this.http.get<any>(`${environment.api}/stadistics/calculateFromCommerceByDay?commerce=${commerceId}&day=${day}`);
  }

  getNewCustomersByDay(commerceId: string, day: string) {
    return this.http.get(`${environment.api}/stadistics/newCustomerReportFromCommerceByDay?commerce=${commerceId}&day=${day}`);
  }

  getTeamPerformanceByDay(commerceId: string, day: string): Observable<TeamPerformance[]> {
    return this.http.get<TeamPerformance[]>(`${environment.api}/stadistics/teamPerformanceFromCommerceByDay?commerce=${commerceId}&day=${day}`);
  }

  getPaymentsByTypeAndDay(commerceId: string, day: string): Observable<PaymentByType[]> {
    return this.http.get<PaymentByType[]>(`${environment.api}/stadistics/paymentsFromCommerceByTypeAndDay?commerce=${commerceId}&day=${day}`);
  }

  getTop5ProductsByDay(commerceId: string, day: string): Observable<Top5ProductsReport[]> {
    return this.http.get<Top5ProductsReport[]>(`${environment.api}/stadistics/productTopFiveFromCommerceByDay?commerce=${commerceId}&day=${day}`);
  }

  getTop5ServicesByDay(commerceId: string, day: string): Observable<Top5ServicesReport[]> {
    return this.http.get<Top5ServicesReport[]>(`${environment.api}/stadistics/serviceTopFiveFromCommerceByDay?commerce=${commerceId}&day=${day}`);
  }

  getReportFromBookingByWeek(commerceId: string, week: number, year: number): Observable<BookingReport> {
    return this.http.get<BookingReport>(`${environment.api}/stadistics/bookingReportFromCommerceByWeek?commerce=${commerceId}&week=${week}&year=${year}`);
  }

  getTop5CustomersByWeek(commerceId: string, week: number, year: number): Observable<Top5CustomersReport[]> {
    return this.http.get<Top5CustomersReport[]>(`${environment.api}/stadistics/customerTopFiveFromCommerceByWeek?commerce=${commerceId}&week=${week}&year=${year}`);
  }

  getTotalBillingByWeek(commerceId: string, week: number, year: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/stadistics/calculateFromCommerceByWeek?commerce=${commerceId}&week=${week}&year=${year}`);
  }

  getNewCustomersByWeek(commerceId: string, week: number, year: number) {
    return this.http.get(`${environment.api}/stadistics/newCustomerReportFromCommerceByWeek?commerce=${commerceId}&week=${week}&year=${year}`);
  }

  getTeamPerformanceByWeek(commerceId: string, week: number, year: number): Observable<TeamPerformance[]> {
    return this.http.get<TeamPerformance[]>(`${environment.api}/stadistics/teamPerformanceFromCommerceByWeek?commerce=${commerceId}&week=${week}&year=${year}`);
  }

  getPaymentsByTypeAndWeek(commerceId: string, week: number, year: number): Observable<PaymentByType[]> {
    return this.http.get<PaymentByType[]>(`${environment.api}/stadistics/paymentsFromCommerceByTypeAndWeek?commerce=${commerceId}&week=${week}&year=${year}`);
  }

  getTop5ProductsByWeek(commerceId: string, week: number, year: number): Observable<Top5ProductsReport[]> {
    return this.http.get<Top5ProductsReport[]>(`${environment.api}/stadistics/productTopFiveFromCommerceByWeek?commerce=${commerceId}&week=${week}&year=${year}`);
  }

  getTop5ServicesByWeek(commerceId: string, week: number, year: number): Observable<Top5ServicesReport[]> {
    return this.http.get<Top5ServicesReport[]>(`${environment.api}/stadistics/serviceTopFiveFromCommerceByWeek?commerce=${commerceId}&week=${week}&year=${year}`);
  }

  getReportFromBookingByMonth(commerceId: string, month: string): Observable<BookingReport> {
    return this.http.get<BookingReport>(`${environment.api}/stadistics/bookingReportFromCommerceByMonth?commerce=${commerceId}&month=${month}`);
  }

  getTop5CustomersByMonth(commerceId: string, month: string): Observable<Top5CustomersReport[]> {
    return this.http.get<Top5CustomersReport[]>(`${environment.api}/stadistics/customerTopFiveFromCommerceByMonth?commerce=${commerceId}&month=${month}`);
  }

  getTotalBillingByMonth(commerceId: string, month: string): Observable<any> {
    return this.http.get<any>(`${environment.api}/stadistics/calculateFromCommerceByMonth?commerce=${commerceId}&month=${month}`);
  }

  getNewCustomersByMonth(commerceId: string, month: string) {
    return this.http.get(`${environment.api}/stadistics/newCustomerReportFromCommerceByMonth?commerce=${commerceId}&month=${month}`);
  }

  getTeamPerformanceByMonth(commerceId: string, month: string): Observable<TeamPerformance[]> {
    return this.http.get<TeamPerformance[]>(`${environment.api}/stadistics/teamPerformanceFromCommerceByMonth?commerce=${commerceId}&month=${month}`);
  }

  getPaymentsByTypeAndMonth(commerceId: string, month: string): Observable<PaymentByType[]> {
    return this.http.get<PaymentByType[]>(`${environment.api}/stadistics/paymentsFromCommerceByTypeAndMonth?commerce=${commerceId}&month=${month}`);
  }

  getTop5ProductsByMonth(commerceId: string, month: string): Observable<Top5ProductsReport[]> {
    return this.http.get<Top5ProductsReport[]>(`${environment.api}/stadistics/productTopFiveFromCommerceByMonth?commerce=${commerceId}&month=${month}`);
  }

  getTop5ServicesByMonth(commerceId: string, month: string): Observable<Top5ServicesReport[]> {
    return this.http.get<Top5ServicesReport[]>(`${environment.api}/stadistics/serviceTopFiveFromCommerceByMonth?commerce=${commerceId}&month=${month}`);
  }

  getReportFromBookingByYear(commerceId: string, year: string): Observable<BookingReport> {
    return this.http.get<BookingReport>(`${environment.api}/stadistics/bookingReportFromCommerceByYear?commerce=${commerceId}&year=${year}`);
  }

  getTop5CustomersByYear(commerceId: string, year: string): Observable<Top5CustomersReport[]> {
    return this.http.get<Top5CustomersReport[]>(`${environment.api}/stadistics/customerTopFiveFromCommerceByYear?commerce=${commerceId}&year=${year}`);
  }

  getTotalBillingByYear(commerceId: string, year: string): Observable<any> {
    return this.http.get<any>(`${environment.api}/stadistics/calculateFromCommerceByYear?commerce=${commerceId}&year=${year}`);
  }

  getNewCustomersByYear(commerceId: string, year: string) {
    return this.http.get(`${environment.api}/stadistics/newCustomerReportFromCommerceByYear?commerce=${commerceId}&year=${year}`);
  }

  getTeamPerformanceByYear(commerceId: string, year: string): Observable<TeamPerformance[]> {
    return this.http.get<TeamPerformance[]>(`${environment.api}/stadistics/teamPerformanceFromCommerceByYear?commerce=${commerceId}&year=${year}`);
  }

  getPaymentsByTypeAndYear(commerceId: string, year: number): Observable<PaymentByType[]> {
    return this.http.get<PaymentByType[]>(`${environment.api}/stadistics/paymentsFromCommerceByTypeAndYear?commerce=${commerceId}&year=${year}`);
  }

  getTop5ProductsByYear(commerceId: string, year: number): Observable<Top5ProductsReport[]> {
    return this.http.get<Top5ProductsReport[]>(`${environment.api}/stadistics/productTopFiveFromCommerceByYear?commerce=${commerceId}&year=${year}`);
  }

  getTop5ServicesByYear(commerceId: string, year: number): Observable<Top5ServicesReport[]> {
    return this.http.get<Top5ServicesReport[]>(`${environment.api}/stadistics/serviceTopFiveFromCommerceByYear?commerce=${commerceId}&year=${year}`);
  }
}
