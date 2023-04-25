import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commerce } from '../../models/commerce/commerce.model';
import { LngLat } from '../../interfaces/long-lat.interface';

@Injectable({
  providedIn: 'root'
})
export class CommerceService {

  constructor(private http: HttpClient) { }

  getCommerceInfoById(uuid: string): Observable<Commerce> {
    return this.http.get<Commerce>(`${environment.api}/commerce/${uuid}`);
  }

  saveCommerce(commerce: Commerce): Observable<Commerce> {
    return this.http.put<Commerce>(`${environment.api}/commerce`, commerce);
  }

  saveCommerceBanned(commerce: Commerce): Observable<Commerce> {
    return this.http.patch<Commerce>(`${environment.api}/commerce`, commerce);
  }


  checkIfSlugExist(slug: string): Observable<Commerce[]>{
    return this.http.get<Commerce[]>(`${environment.api}/commerce/slug/${slug}`);
  }
  checkIfNameExist(name: string): Observable<Commerce[]>{
    return this.http.get<Commerce[]>(`${environment.api}/commerce/name/${name}`);
  }

  updateCommerceCoordinates(uuid: string, lngLat: LngLat): Observable<Commerce> {
    return this.http.put<Commerce>(`${environment.api}/commerce/coordinates/${uuid}`, lngLat);
  }

}
