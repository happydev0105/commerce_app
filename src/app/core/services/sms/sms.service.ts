import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SmsDto } from '../../dto/sms.dto';
import { SmsResponse } from '../../interfaces/sms-response.interface';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  apiUrl = environment.api;

  constructor(private http: HttpClient) { }

  sendSms(commerceId: string, smsDto: SmsDto): Observable<SmsResponse> {
    return this.http.post<SmsResponse>(`${this.apiUrl}/commerce/sms/${commerceId}/send-sms`, smsDto);
  }
}
