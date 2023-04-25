import { ICategoryService } from './category-service.interface';

export interface IService {
  uuid: string;
  name: string;
  price: number;
  defaultDuration: number;
  color: string;
  isPublic: boolean;
  commerce: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  category: ICategoryService;
  isDeleted: boolean;
  order: number;
  quantity: number;
}
