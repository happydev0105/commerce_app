import { Commerce } from '../models/commerce/commerce.model';

export class SmsDto {
    commerce: Commerce;
    destination: string[];
    message: string;
}
