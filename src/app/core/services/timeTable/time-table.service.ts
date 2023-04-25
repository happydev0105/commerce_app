import { Observable, Subject } from 'rxjs';
import { TimeTableDto } from './../../models/timeTable/timeTable.dto.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TimeTable } from '../../models/timeTable/timeTable.model';
import { environment } from 'src/environments/environment';
import { UpdateTimeTableDayDto } from '../../models/timeTable/update-timeTable-day.dto';
import { Commerce } from '../../models/commerce/commerce.model';
import { Employee } from '../../models/employee/employee.model';

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {

  updateHourday = new Subject<TimeTable>();
  updateHourday$ = this.updateHourday.asObservable();

  updateHourDayNewEmployee = new Subject<UpdateTimeTableDayDto>();
  updateHourDayNewEmployee$ = this.updateHourDayNewEmployee.asObservable();

  constructor(private http: HttpClient) { }

  createEmployeeTimeTable(timeTable: TimeTableDto): Observable<TimeTable> {
    return this.http.post<TimeTable>(`${environment.api}/timetable`, timeTable);
  }

  getTimeTableById(id: string): Observable<TimeTable> {
    return this.http.get<TimeTable>(`${environment.api}/timetable/${id}`);
  }

  updateTimeTable(timeTable: TimeTableDto) {
    return this.http.patch<TimeTable>(`${environment.api}/timetable`, timeTable);
  }

  updateTimeTableDay(updateTimeTableDayDto: UpdateTimeTableDayDto): Observable<TimeTable> {
    return this.http.post<TimeTable>(`${environment.api}/timetable/update-hour-day`, updateTimeTableDayDto);
  }

  updateTimeTableDayCommerce(updateTimeTableDayDto: UpdateTimeTableDayDto): Observable<TimeTable> {
    return this.http.post<TimeTable>(`${environment.api}/timetable/update-hour-day-commerce`, updateTimeTableDayDto);
  }

  findTimetableByCommerce(commerce: string): Observable<Commerce> {
    return this.http.get<Commerce>(
      `${environment.api}/commerce/${commerce}`
    );
  }
  findTimetableByCommerceAgendaPage(commerce: string): Observable<Commerce> {
    return this.http.get<Commerce>(
      `${environment.api}/commerce/agenda/${commerce}`
    );
  }

  findTimetableOnlyEntityByCommerce(commerce: string): Observable<TimeTable> {
    return this.http.get<TimeTable>(
      `${environment.api}/timetable/commerce/${commerce}`
    );
  }
  findTimetableByEmployee(employee: string): Observable<Employee> {
    return this.http.get<Employee>(
      `${environment.api}/employee/${employee}`
    );
  }

  updateObservable(value: TimeTable) {
    this.updateHourday.next(value);
  }

  updateObservableNewEmployee(value: UpdateTimeTableDayDto) {
    this.updateHourDayNewEmployee.next(value);
  }
}
