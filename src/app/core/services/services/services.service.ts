import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceDto } from '../../dto/service.dto';
import { ServiceCategoryDto } from '../../dto/serviceCategory.dto';
import { ICategoryService } from '../../interfaces/category-service.interface';
import { IService } from '../../interfaces/services.interface';
import { YeasyHttpResponse } from '../../models/http.model';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private apiUrl = environment.api;

  constructor(private http: HttpClient) { }

  findServiceByCommerce(commerce: string): Observable<IService[]> {
    return this.http.get<IService[]>(`${this.apiUrl}/services/`, {
      params: {
        commerce,
      },
    });
  }
  createService(service: ServiceDto): Observable<IService> {
    return this.http.post<IService>(`${this.apiUrl}/services/`, service);
  }

  deleteService(service: IService): Observable<YeasyHttpResponse> {
    return this.http.delete<YeasyHttpResponse>(`${this.apiUrl}/services/${service.uuid}`);
  }

  findServiceCategoryByCommerce(commerceID: string): Observable<ICategoryService[]> {
    return this.http.get<ICategoryService[]>(`${this.apiUrl}/service-category/`, {
      params: {
        commerce: commerceID
      },
    });
  }

  createCategoryService(service: ServiceCategoryDto): Observable<ICategoryService> {
    return this.http.post<ICategoryService>(`${this.apiUrl}/service-category/`, service);
  }
  updateCategoryService(service: ServiceCategoryDto): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/service-category/`, service);
  }

  updateOrder(serviceCollection: IService[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/services/order/`,serviceCollection);
  }

  deleteCategoryService(categoryUuid: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/service-category/${categoryUuid}`);

  }
}
