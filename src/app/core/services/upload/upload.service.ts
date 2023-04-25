import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UploadResponse } from '../../interfaces/upload-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  sendUploadImage(image: File, type: string, uuid: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<UploadResponse>(`${environment.api}/upload/image/${type}/${uuid}`, formData);
  }

  sendUploadCommerceLogoImage(image: File, type: string, uuid: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<UploadResponse>(`${environment.api}/upload/image/${type}/logo/${uuid}`, formData);
  }

  sendUploadCommerceBackgroundImage(image: File, type: string, uuid: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<UploadResponse>(`${environment.api}/upload/image/${type}/background/${uuid}`, formData);
  }

  sendUploadGalleryCommerceImage(image: File, type: string, uuid: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<UploadResponse>(`${environment.api}/upload/image/gallery/${type}/${uuid}`, formData);
  }

  sendUploadEmployeeImage(image: File, type: string, uuid: string): Observable<UploadResponse> {
    const commerceUuid = JSON.parse(localStorage.getItem('currentCommerce')).uuid;
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<UploadResponse>(`${environment.api}/upload/image/commerce/${commerceUuid}/${type}/${uuid}`, formData);
  }

  getBase64Image(imageName: string, commerceId: string): Observable<{ data: string }> {
    return this.http.get<{ data: string }>(`${environment.api}/upload/imageBase64/${imageName}/${commerceId}`);
  }
}
