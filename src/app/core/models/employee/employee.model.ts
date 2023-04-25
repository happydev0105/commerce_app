import { EmployeeRole } from '../enums/role.enum';
import { Permission } from '../permission/permission.model';
import { Booking } from '../reservation.model';
import { Service } from '../service.model';
import { TimeTable } from '../timeTable/timeTable.model';


export class Employee {
  uuid: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  image: string;
  commerce: string;
  position: string;
  description: string;
  phone: string;
  services?: Service[];
  timetable: TimeTable;
  isActive: boolean;
  isEmployee: boolean;
  isOwner: boolean;
  role: EmployeeRole;
  order: number;
  hasUnpaidBooking?: boolean;
  permissions: Permission[];
  isAmbassador: boolean;
  ambassadorCode: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdAtCustom: string;
  booking?: Booking[];
}
