import { NavController } from '@ionic/angular';
import { Employee } from './../../models/employee/employee.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerDto } from '../../models/customer/customer.dto.model';
import { SuccessHttpResponse } from '../../models/http.model';
import { fromUnixTime, isAfter } from 'date-fns';
import { map } from 'rxjs/operators';
import { Permission } from 'src/app/core/models/permission/permission.model';


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AccessTokenResponse {
  user: Employee;
  access_token: string;
}

export interface Payload {
  id: string;
  exp: number;
}

export interface ResetPasswordRequest {
  customerId: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: BehaviorSubject<Employee> = new BehaviorSubject<Employee>(null);
  public $user: BehaviorSubject<string | null> = new BehaviorSubject<string | null>('');
  private currentUserSubject: BehaviorSubject<Employee>;



  constructor(private http: HttpClient, private navCtrl: NavController) {
    this.currentUserSubject = new BehaviorSubject<Employee>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser.next(this.currentUserSubject.value);
  }

  registerNewUser(user: CustomerDto): Observable<AccessTokenResponse> {
    return this.http.post<AccessTokenResponse>(`${environment.api}/authentication/register`, user).pipe(map(res => this.setSession(res)));
  }

  loginWithEmail(loginCredentials: LoginCredentials): Observable<AccessTokenResponse> {
    return this.http.post<AccessTokenResponse>(`${environment.api}/authentication/login/commerce`, loginCredentials)
      .pipe(map(res => this.setSession(res)));
  }

  resetPassword(email: string): Observable<any> {
    return this.http.get<any>(`${environment.api}/mailer/recovery/employee/${email}`);
  }

  setSession(authResult: AccessTokenResponse) {
    const payload = this.decodeToken(authResult.access_token);
    localStorage.setItem('id_token', authResult.access_token);
    this.$user.next(payload.customerId);
    localStorage.setItem('expires_at', payload.expiration);
    this.currentUserSubject.next(authResult.user);
    return authResult;
  }

  decodeToken(token: string): any {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('filteredEmployee');
    localStorage.removeItem('tableWidth');
    localStorage.removeItem('columnWidth');
    localStorage.removeItem('currentCommerce');
    sessionStorage.removeItem('permission');
    this.currentUserSubject.next(null);
    this.navCtrl.navigateRoot(['/login']);
  }

  public ifLoggedSetUser() {
    if (this.isLoggedIn()) {
      const accessToken = localStorage.getItem('id_token') || '';
      this.$user.next(this.decodeToken(accessToken).customerId);
    }
  }

  public isLoggedIn() {
    return isAfter(this.getExpiration(), new Date());
  }

  public get currentUserValue(): Employee {
    return this.currentUserSubject.value;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration(): Date {
    const expiration = localStorage.getItem('expires_at') || '';
    return fromUnixTime(parseInt(expiration, 10));
  }

  checkPermission(permissionName: string): Permission {
    return JSON.parse(localStorage.getItem('currentUser')).permissions.find(permission => permission.name === permissionName);
  }
}
