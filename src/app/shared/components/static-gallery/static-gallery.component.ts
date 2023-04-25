import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

interface IStaticGallery {
  title: string;
  image: string;
}

@Component({
  selector: 'app-static-gallery',
  templateUrl: './static-gallery.component.html',
  styleUrls: ['./static-gallery.component.scss'],
})

export class StaticGalleryComponent implements OnInit {

  staticGallery: IStaticGallery[] = [];
  selectedItem: IStaticGallery;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ionViewWillEnter() {
    this.staticGallery = [];
    this.staticGallery.push(
      {
        title: '',
        image: '/assets/static-gallery/sg_1.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_2.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_3.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_4.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_5.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_6.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_7.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_8.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_9.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_10.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_11.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_12.jpg'
      },
      {
        title: '',
        image: '/assets/static-gallery/sg_13.jpg'
      }
    );
  }

  ngOnInit() {}

  selectImage(item: IStaticGallery) {
    this.selectedItem = item;
    this.modalCtrl.dismiss({ selectedItem: this.selectedItem, fromGallery: false });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
