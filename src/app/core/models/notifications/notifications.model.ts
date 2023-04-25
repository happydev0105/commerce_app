import { Employee } from '../employee/employee.model';

export class Notifications {
  uuid: string;
  title: string;
  body: string;
  isRead: boolean;
  employee: Employee;
  relatedUuid: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  createdGroup: string;
  createdBy: string;
}
export class NotificationGroup {
  key: Notifications[];

}