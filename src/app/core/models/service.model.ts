import { ICategoryService } from '../interfaces/category-service.interface';

export class Service {
  uuid?: string;
  name: string;
  price: number;
  color: string;
  defaultDuration: number;
  commerce: string;
  isPublic: boolean;
  category: ICategoryService;
  quantity: number;
}
