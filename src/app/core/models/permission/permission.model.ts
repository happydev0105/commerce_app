import { Employee } from 'src/app/core/models/employee/employee.model';
export class Permission {
  uuid: string;
  name: string;
  description: string;
  employee: Employee;
  roles: string[];

  constructor(name: string) {
    this.name = name;
  }
}
