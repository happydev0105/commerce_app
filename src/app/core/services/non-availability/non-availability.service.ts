import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NonAvailabilityDto } from '../../dto/non-availability.dto';
import { WeeklyNonAvailability } from '../../dto/weekly-non-availability.dto';
import { INonAvailability } from '../../interfaces/non-availability.interface';
import { NonAvailability } from '../../models/non-availability.model';

@Injectable({
  providedIn: 'root',
})
export class NonAvailabilityService {
  private apiUrl = environment.api;

  constructor(private http: HttpClient) { }

  public findAllNonAvailabilityByDay(
    commerce: string,
    date: string
  ): Observable<NonAvailability[]> {
    return this.http.get<NonAvailability[]>(`${this.apiUrl}/non-availability`, {
      params: {
        commerce,
        date,
      },
    });
  }
  public findAllNonAvailabilityByWeek(
    commerce: string,
    week: number
  ): Observable<WeeklyNonAvailability> {
    return this.http.get<WeeklyNonAvailability>(`${this.apiUrl}/non-availability/weekly`, {
      params: {
        week,
        commerce,
      },
    });
  }
  public saveNonAvailability(
    nonAvailability: NonAvailabilityDto
  ): Observable<INonAvailability> {
    return this.http.post<INonAvailability>(
      `${this.apiUrl}/non-availability`,
      nonAvailability
    );
  }

  public editNonAvailability(
    nonAvailability: NonAvailabilityDto
  ): Observable<INonAvailability> {
    return this.http.patch<INonAvailability>(
      `${this.apiUrl}/non-availability`,
      nonAvailability
    );
  }

  public getNonAvailabilityById(id: string): Observable<INonAvailability> {
    return this.http.get<INonAvailability>(
      `${this.apiUrl}/non-availability/${id}`
    );
  }
  public getHolidaysByEmployee(id: string): Observable<INonAvailability[]> {
    return this.http.get<INonAvailability[]>(
      `${this.apiUrl}/non-availability/holidays/${id}`
    );
  }
  public getHolidaysByCode(holydayCode: string): Observable<INonAvailability[]> {
    return this.http.get<INonAvailability[]>(
      `${this.apiUrl}/non-availability/holidaysCode/${holydayCode}`
    );
  }
  public deleteNonAvailabilityById(id: string): Observable<INonAvailability> {
    return this.http.delete<INonAvailability>(
      `${this.apiUrl}/non-availability/${id}`
    );
  }

  public deleteHolidayById(id: string): Observable<INonAvailability> {
    return this.http.delete<INonAvailability>(
      `${this.apiUrl}/non-availability/holiday/${id}`
    );
  }
}
