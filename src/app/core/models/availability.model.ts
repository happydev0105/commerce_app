import { AvailabilityTime } from './availabilityTime.model';
import { Employee } from './employee/employee.model';


export class Availability {
  employee: Employee;
  availability: {
    morning: AvailabilityTime[];
    afternoon: AvailabilityTime[];
    evening: AvailabilityTime[];
  };
}
