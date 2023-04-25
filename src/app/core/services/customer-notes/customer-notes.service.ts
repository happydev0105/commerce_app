import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerNoteDto } from '../../dto/customer-notes/customer-notes.dto';
import { DeleteResult } from '../../interfaces/delete-results.interface';
import { CustomerNote } from '../../models/customer-notes/customer-notes.model';
import { Customer } from '../../models/customer/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerNotesService {

  constructor(private http: HttpClient) { }

  createNote(dto: CustomerNoteDto): Observable<CustomerNote> {
    return this.http.post<CustomerNote>(`${environment.api}/customer-notes/`, dto);
  }

  getAllCustomerNote(commerceUuid: string, customerUuid: string): Observable<CustomerNote[]> {
    return this.http.get<CustomerNote[]>(`${environment.api}/customer-notes/${commerceUuid}/${customerUuid}`);
  }

  removeNote(noteId: string): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(`${environment.api}/customer-notes/${noteId}`);
  }
}
