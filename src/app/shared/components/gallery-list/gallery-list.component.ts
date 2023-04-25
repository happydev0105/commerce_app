import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Gallery } from 'src/app/core/models/gallery/gallery.model';
import { GalleryService } from 'src/app/core/services/gallery/gallery.service';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.scss'],
})
export class GalleryListComponent implements OnDestroy {
  commerceLogged: string;
  subscription: Subscription = new Subscription();
  gallery: Gallery;
  selectedImage = '';

  constructor(
    private galleryService: GalleryService,
    private modalCtrl: ModalController
  ) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
  }

  ionViewWillEnter() {
    this.getGalleryByCommerce();
  }

  getGalleryByCommerce() {
    this.subscription.add(this.galleryService.findByCommerce(this.commerceLogged).subscribe(response => {
      if (response) {
        this.gallery = Object.assign(response);
      }
    }));
  }

  selectImage(image: string) {
    this.selectedImage = image;
    this.modalCtrl.dismiss({selectedImage: image, fromGallery: true});
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
