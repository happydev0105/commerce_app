import { Employee } from "../models/employee/employee.model";

export class NotificationsDto{

    title: string;
 
    body: string;
  
    isRead: boolean;
  
    employee: Employee;
}