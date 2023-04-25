import { Commerce } from '../../models/commerce/commerce.model';
import { Customer } from '../../models/customer/customer.model';
import { Employee } from '../../models/employee/employee.model';


export class CustomerNoteDto {
    uuid?: string;
    note: string;
    commerce: string;
    customer: string;
    author: string;

}
