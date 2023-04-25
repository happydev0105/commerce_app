import { ProductDto } from './../../models/product/product.dto';
import { Product } from 'src/app/core/models/product/product.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YeasyHttpResponse } from '../../models/http.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.api}/product`);
  }

  getByCommerce(commerceId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.api}/product/${commerceId}`);
  }

  create(product: ProductDto): Observable<Product> {
    return this.http.post<Product>(`${environment.api}/product`, product);
  }

  update(product: ProductDto): Observable<Product> {
    return this.http.put<Product>(`${environment.api}/product`, product);
  }

  deleteProduct(uuid: string): Observable<YeasyHttpResponse> {
    return this.http.delete<YeasyHttpResponse>(`${environment.api}/product/${uuid}`);
  }
}
