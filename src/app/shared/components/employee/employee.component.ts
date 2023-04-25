import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { format } from 'date-fns';
import { EDays } from 'src/app/core/enums/days.enum';
import { DayModel } from 'src/app/core/models/day.model';
import { Employee } from 'src/app/core/models/employee/employee.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnChanges {
  @Input() employee: Employee;
  @Input() selectedDate: DayModel;

  columnWidth: string;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    const value = localStorage.getItem('columnWidth');
    this.columnWidth = value + 'px';
  }

  showDayTimetable(): string {
    const index = this.selectedDate.date.getDay();
    if (this.employee?.timetable) {
      const timetable = JSON.parse(this.employee?.timetable[EDays[index]]);
      if (timetable.start.hour === null) {
        return 'Cerrado';
      }
      const start = new Date(2022, 1, 1, timetable.start.hour, timetable.start.minute);
      const end = new Date(2022, 1, 1, timetable.end.hour, timetable.end.minute);
      const startHour = format(start, 'HH:mm');
      const endHour = format(end, 'HH:mm');
      return startHour + '-' + endHour;
    }

  }
}
