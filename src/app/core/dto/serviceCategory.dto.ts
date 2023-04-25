import { IService } from '../interfaces/services.interface';
import { Commerce } from '../models/commerce/commerce.model';

export class ServiceCategoryDto {
    uuid: string;
    name: string;
    commerce: string;
    services: IService[];
}
