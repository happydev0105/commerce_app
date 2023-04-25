import { EmployeeDto } from './../../models/employee/employee.dto.model';
import { Employee } from './../../models/employee/employee.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IService } from '../../interfaces/services.interface';
import { Permission } from '../../models/permission/permission.model';
import { YeasyHttpResponse } from '../../models/http.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  getAllEmployee(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.api}/employee`);
  }

  createEmployee(employee: EmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(`${environment.api}/employee`, employee);
  }



  findEmployees(commerceID: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${environment.api}/employee/commerce/${commerceID}`
    );
  }
  findEmployeesWithinactives(commerceID: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${environment.api}/employee/commerce-with-inactives/${commerceID}`
    );
  }
  findEmployeesAgenda(commerceID: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${environment.api}/employee/commerce-agenda/${commerceID}`
    );
  }

  findEmployeeById(employeeId: string): Observable<Employee> {
    return this.http.get<Employee>(`${environment.api}/employee/${employeeId}`);
  }
  findEmployeeByCommerceAndServices(commerce: string, services: IService[]): Observable<Employee> {
    return this.http.post<Employee>(`${environment.api}/employee/commerce-services/${commerce}`, services);
  }
  updateEmployee(employee: EmployeeDto): Observable<Employee> {
    return this.http.patch<Employee>(`${environment.api}/employee`, employee);
  }
  findEmployeesWithinactivesPayments(commerceID: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${environment.api}/employee/commerce-with-inactives-payments/${commerceID}`
    );
  }


  updateOrder(employeeCollection: Employee[]): Observable<any> {
    return this.http.post<any>(`${environment.api}/employee/order/`,employeeCollection);
  }
  deleteEmployee(uuid: string): Observable<YeasyHttpResponse> {
    return this.http.delete<YeasyHttpResponse>(`${environment.api}/employee/${uuid}`);
  }

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${environment.api}/permission`);
  }
}
