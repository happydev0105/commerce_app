import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TicketComment } from '../../models/comment/comment.model';
import { Ticket } from '../../models/ticket/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  API_URL = environment.api;

  constructor(private http: HttpClient) { }

  getTicketsByCommerce(commerceId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.API_URL}/ticket/commerce/${commerceId}`);
  }

  createNewTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.API_URL}/ticket`, ticket);
  }

  createNewComment(comment: TicketComment): Observable<TicketComment> {
    return this.http.post<TicketComment>(`${this.API_URL}/comment`, comment);
  }
}
