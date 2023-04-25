import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationsDto } from '../../dto/notifications.dto';
import { DeleteResult } from '../../interfaces/delete-results.interface';
import { Notifications } from '../../models/notifications/notifications.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {


  constructor(private http: HttpClient) { }

  getAll(): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(`${environment.api}/notification`);
  }

  getByEmployee(employee: string): Observable<Notifications[]> {
    return this.http.get<Notifications[]>
    (`${environment.api}/notification/employee/${employee}`).pipe(map(response =>  [...this.addCreatedGroup(response)]));
  }

  create(product: NotificationsDto): Observable<Notifications> {
    return this.http.post<Notifications>(`${environment.api}/notification`, product);
  }

  update(product: NotificationsDto): Observable<Notifications> {
    return this.http.put<Notifications>(`${environment.api}/notification`, product);
  }

  deleteProduct(uuid: string): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`${environment.api}/notification/${uuid}`);
  }

  markAsRead(employee: string): Observable<Notifications[]> {


    return this.http.get<Notifications[]>(`${environment.api}/notification/employee/${employee}/mark-as-read`,
    { headers:  new HttpHeaders({'no-follow': 'no-follow'}) });
  }

  addCreatedGroup(notification: Notifications[]): Notifications[]{
    return notification.filter
    (notificationItem => notificationItem.createdGroup = format(new Date(notificationItem.createdAt),'dd/MM/yyyy'));
  }
}
