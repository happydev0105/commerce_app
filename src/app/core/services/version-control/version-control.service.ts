import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IVersionControl } from '../../interfaces/version-control/version-control.interface';

@Injectable({
  providedIn: 'root'
})
export class VersionControlService {

  apiUrl = environment.api;

  constructor(private http: HttpClient) { }

  findVersionByType(): Observable<IVersionControl> {
    return this.http.get<IVersionControl>(`${this.apiUrl}/version-control/bytype/Business`);
  }


}
