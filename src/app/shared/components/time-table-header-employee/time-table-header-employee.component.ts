import { Component, Input } from '@angular/core';
import { Employee } from 'src/app/core/models/employee/employee.model';

@Component({
  selector: 'app-time-table-header-employee',
  templateUrl: './time-table-header-employee.component.html',
  styleUrls: ['./time-table-header-employee.component.scss'],
})
export class TimeTableHeaderEmployeeComponent {
  @Input() employeeCollection: Employee[];

  constructor() {}
}
