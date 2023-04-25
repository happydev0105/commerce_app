import { ServiceDto } from "../../dto/service.dto";
import { EmployeeRole } from "../enums/role.enum";
import { Permission } from "../permission/permission.model";
import { Booking } from "../reservation.model";
import { Service } from "../service.model";

export class EmployeeDto {
  uuid?: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
  image?: string;
  position: string;
  description?: string;
  phone: string;
  order: number;
  isActive: boolean;
  isEmployee: boolean;
  commerce: string;
  services?: Service[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  role: EmployeeRole;
  permissions: Permission[];
  createdAtCustom: string;
  booking?: Booking[];
}
