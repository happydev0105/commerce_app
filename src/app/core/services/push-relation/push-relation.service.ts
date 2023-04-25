import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreatePushRelation } from '../../models/push-relation.model';

@Injectable({
  providedIn: 'root'
})
export class PushRelationService {

  constructor(private http: HttpClient) { }

  saveRelation(relation: CreatePushRelation): Observable<CreatePushRelation> {
    return this.http.post<CreatePushRelation>(`${environment.api}/push-relation/`, relation);
  }
  removeRelation(oneSignalUuid: string) {
    return this.http.delete<CreatePushRelation>(`${environment.api}/push-relation/` + oneSignalUuid);
  }
}
