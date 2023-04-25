
import { Employee } from '../employee/employee.model';

export class CustomerNote {
    uuid: string;
    note: string;
    commerce: string;
    customer: string;
    author: Employee;
    createdAt: string;
    updatedAt: string;
}
