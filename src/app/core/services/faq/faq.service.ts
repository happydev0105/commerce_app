import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FAQ } from '../../models/faq/faq.model';
import { FAQCategory } from '../../models/faq/faq-category/faq-category.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  type = 'commerce';

  constructor(private http: HttpClient) { }

  getAllByCategory(categoryId: string): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(`${environment.api}/faq/category/${categoryId}`);
  }

  getAllFAQcategories(): Observable<FAQCategory[]> {
    return this.http.get<FAQCategory[]>(`${environment.api}/faq-category`);
  }

}
