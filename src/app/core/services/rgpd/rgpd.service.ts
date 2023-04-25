import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RGPD } from '../../models/rgpd/rgpd.model';

@Injectable({
  providedIn: 'root'
})
export class RgpdService {

  constructor(private http: HttpClient) { }

  getAllRGPD(): Observable<RGPD[]> {
    return this.http.get<RGPD[]>(`${environment.api}/rgpd`);
  }
}
