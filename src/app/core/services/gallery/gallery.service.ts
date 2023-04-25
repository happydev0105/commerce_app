import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gallery } from '../../models/gallery/gallery.model';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(private http: HttpClient) { }

  saveGallery(gallery: Gallery): Observable<Gallery> {
    return this.http.post<Gallery>(`${environment.api}/gallery`, gallery);
  }

  updateGallery(gallery: Gallery): Observable<Gallery> {
    return this.http.patch<Gallery>(`${environment.api}/gallery/${gallery.uuid}`, gallery);
  }

  findByCommerce(commerceId: string): Observable<Gallery> {
    return this.http.get<Gallery>(`${environment.api}/gallery/commerce/${commerceId}`);
  }
}
