import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ITraining } from '../../interfaces/training.interface';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  apiUrl = environment.api;

  constructor(private http: HttpClient) { }

  findVideosFromMonth(month: number): Observable<ITraining[]> {
    return this.http.get<ITraining[]>(`${this.apiUrl}/training/fromMonth/${month}`);
  }
  saveVideos(video: ITraining): Observable<ITraining> {
    return this.http.post<ITraining>(`${this.apiUrl}/training`, video);
  }
  removeVideo(video: ITraining): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/training/${video.uuid}`);
  }
}
