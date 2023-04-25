import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as maplibregl from 'maplibre-gl';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { CommerceService } from 'src/app/core/services/commerce/commerce.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  marker: maplibregl.Marker;
  map: maplibregl.Map;
  lngLat: maplibregl.LngLat;
  commerce: Commerce;
  zoom: number
  constructor(private commerceService: CommerceService, private toastService: ToastService, private navCtrl: NavController) {
    this.commerce = JSON.parse(localStorage.getItem('currentCommerce'));
    this.zoom = this.commerce.long.length > 0 ? 15 : 5;
  }

  ngOnInit() {
    this.map = new maplibregl.Map({
      container: 'map',
      style:
      'https://api.maptiler.com/maps/streets/style.json?key=48iIvWSi0HqIxUi8Jr1e',
      center: [Number.parseFloat(this.commerce.long) ? Number.parseFloat(this.commerce.long) : -3.7032830165044004,
      Number.parseFloat(this.commerce.lat) ? Number.parseFloat(this.commerce.lat) : 40.416735100628586],
      zoom: this.zoom,
      attributionControl: false
    });

    this.marker = new maplibregl.Marker({
      color: '#000',
      draggable: true
    });


    this.marker.setLngLat([Number.parseFloat(this.commerce.long) ? Number.parseFloat(this.commerce.long) : -3.7032830165044004,
    Number.parseFloat(this.commerce.lat) ? Number.parseFloat(this.commerce.lat) : 40.416735100628586])
      .addTo(this.map);

    this.marker.on('dragend', () => {
      this.lngLat = this.marker.getLngLat();
      console.log(this.lngLat);

    });
  }

  saveLocation() {
    if (this.lngLat.lat !== undefined && this.lngLat.lng !== undefined) {
      this.commerceService.updateCommerceCoordinates(this.commerce.uuid, this.lngLat).subscribe((res: any) => {
        this.toastService.presentToast('Ubicación guardada correctamente', true);
        this.navCtrl.navigateBack('tabs/profile');
      });
    }
    else {
      this.toastService.presentToast('Por favor intentelo de nuevo.', false)
    }
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }
}
