import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Employee } from './models/employee/employee.model';
import { AppVersionService } from './services/app-version/app-version.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  apiUrl = environment.api;

  constructor(private http: HttpClient, private appVersionService: AppVersionService) { }

  init(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
     
      const loggedUser: Employee = JSON.parse(localStorage.getItem('currentUser'));
      if (loggedUser) {
        this.http.get((`${this.apiUrl}/employee/check-if-exist/${loggedUser.uuid}`))
          .toPromise()
          .then((res: boolean) => {
            if (res) {
              resolve(true);
            } else {
              localStorage.removeItem('currentUser');
              localStorage.removeItem('currentCommerce');
              localStorage.removeItem('id_token');
              localStorage.removeItem('expires_at');
              localStorage.removeItem('wizard');
              resolve(true);
            }
          });
      } else {
        resolve(true);
      }
    });
  }
}
