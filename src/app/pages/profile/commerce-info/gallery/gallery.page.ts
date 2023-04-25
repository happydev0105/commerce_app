import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, IonModal, ItemReorderEventDetail, ModalController } from '@ionic/angular';
import { getTime } from 'date-fns';
import { Subscription } from 'rxjs';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { Gallery } from 'src/app/core/models/gallery/gallery.model';
import { CommerceService } from 'src/app/core/services/commerce/commerce.service';
import { GalleryService } from 'src/app/core/services/gallery/gallery.service';
import { UploadService } from 'src/app/core/services/upload/upload.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { CropImgComponent } from 'src/app/shared/components/crop-img/crop-img.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit, OnDestroy {

  @ViewChild(AlertComponent) deleteAlert: AlertComponent;
  @ViewChild(IonModal) showDetailModal: IonModal;

  gallery: Gallery;
  commerce: Commerce;
  selectedImage = '';

  subscription: Subscription = new Subscription();

  constructor(
    private actionSheetController: ActionSheetController,
    private galleryService: GalleryService,
    private modalCtrl: ModalController,
    private utilsService: UtilsService,
    private uploadService: UploadService,
    private commerceService: CommerceService,
  ) {
    this.getGalleryFromCommerce();
  }

  ngOnInit() {
  }

  getGalleryFromCommerce() {
    this.commerce = JSON.parse(localStorage.getItem('currentCommerce'));
    this.galleryService.findByCommerce(this.commerce.uuid).subscribe(response => {
      if (response) {
        this.gallery = Object.assign(response);
      } else {
        this.gallery = new Gallery();
        this.gallery.commerce = this.commerce.uuid;
        this.gallery.images = [];
        this.gallery.name = this.commerce.name;
      }

    });
  }

  async goToSelectImage() {
    let optionSelected = '';
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Hacer foto',
          icon: 'camera-outline',
          role: 'camera',
          handler: async () => {
            optionSelected = 'camera';
            await this.selectImageFromDevice(optionSelected);
          },
        },
        {
          text: 'Seleccionar de la galería',
          icon: 'image-outline',
          role: 'gallery',
          handler: async () => {
            optionSelected = 'gallery';
            await this.selectImageFromDevice(optionSelected);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'destructive'
        }
      ]
    });
    await actionSheet.present();
  }

  async selectImageFromDevice(optionSelected: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: optionSelected === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      promptLabelHeader: 'Selecciona una imagen',
      promptLabelPicture: 'Haz una foto',
      promptLabelPhoto: 'Desde la galería',
      promptLabelCancel: 'Cancelar',
    });
    const imageBlob = this.utilsService.convertBase64ToBlob(image.dataUrl);
    const filename = this.utilsService.generateRandomFileName(`yeasy_${getTime(new Date())}.png`);
    const imageFile = new File([imageBlob], `${filename}`, { type: imageBlob.type });
    this.openModal(imageBlob, 'logo');
  }
  async openModal(image, from) {
    const modal = await this.modalCtrl.create({
      component: CropImgComponent,
      componentProps: {
        imageChangedEvent: image,
        aspectRatio: from === 'logo' ? 1 / 1 : 16 / 9
      },
      backdropDismiss: true,
      animated: true,
      initialBreakpoint: 1,
      backdropBreakpoint: 1,
      showBackdrop: true
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'ok') {
      const imageBlob = this.utilsService.convertBase64ToBlob(data);
      const filename = this.utilsService.generateRandomFileName(`yeasy_${getTime(new Date())}.png`);
      const imageFile = new File([imageBlob], `${filename}`, { type: imageBlob.type });
      this.subscription.add(this.uploadService.sendUploadGalleryCommerceImage(imageFile, 'commerce', this.commerce.uuid).subscribe(response => {
        if (response) {
          this.gallery.images.push(filename);
          this.subscription.add(this.galleryService.saveGallery(this.gallery).subscribe(result => {
            if (result) {
              this.getGalleryFromCommerce();
            }
          }));
        }
      }));
    }
  }

  openViewDetail(image: string) {
    this.showDetailModal.present();
    this.selectedImage = image;
  }

  showConfirm() {
    this.deleteAlert.presentAlertConfirm();
  }

  alertBox(value: boolean) {
    if (value) {
      this.deleteImage();
    }
  }

  deleteImage() {
    const index = this.gallery.images.indexOf(this.selectedImage);
    this.gallery.images.splice(index, 1);
    this.galleryService.saveGallery(this.gallery).subscribe(response => {
      if (response) {
        this.getGalleryFromCommerce();
        this.showDetailModal.dismiss();
      }
    });
  }

  handleReorder(
    ev: CustomEvent<ItemReorderEventDetail>,
    array: string[]
  ) {
    const arr = ev.detail.complete(array);
    console.log(arr);

    this.updateGalleryOrder(arr);
  }
  updateGalleryOrder(arr: string[]) {
    const gallery = new Gallery();
    gallery.commerce = this.commerce.uuid;
    gallery.images = arr;
    gallery.name = this.commerce.name;
    gallery.uuid = this.gallery.uuid;

    this.galleryService.updateGallery(gallery).subscribe(res => {
      console.log(res);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
