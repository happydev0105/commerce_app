import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'getImage'
})
export class GetImagePipe implements PipeTransform {

  transform(value: string, type: string, uuid: string): string {
    const commerceUuid = JSON.parse(localStorage.getItem('currentCommerce')).uuid;
    if (!value) {
      return 'assets/no-image.jpeg';
    }
    if (value.includes('base64') || value.includes('googleusercontent')) {
      return value;
    }
    let url = `${environment.server}uploads/images/${type}/${uuid}/`;
    if (type === 'employee') {
      url = `${environment.server}uploads/images/commerce/${commerceUuid}/${type}/${uuid}/`;
    }
    url += value;
    return url;
  }

}
