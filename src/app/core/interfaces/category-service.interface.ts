import { Commerce } from '../models/commerce/commerce.model';
import { IService } from './services.interface';

export interface ICategoryService {
    uuid: string;
    name: string;
    commerce: Commerce;
    services: IService[];
    createdAt: string;
}
