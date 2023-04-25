import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { isPlatform, ModalController } from '@ionic/angular';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-crop-img',
  templateUrl: './crop-img.component.html',
  styleUrls: ['./crop-img.component.scss'],
})
export class CropImgComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation?: number;
  translateH = 0;
  translateV = 0;
  scale = 1;
  aspectRatio = 1 / 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {
    translateUnit: 'px'
  };
  imageURL?: string;
  loading = false;
  allowMoveImage = false;
  hidden = false;
  isIos = false;

  constructor(
    private modalCtrl: ModalController,
    private cd: ChangeDetectorRef
  ) {
    this.isIos = isPlatform('android') ? false : true;
  }

  ngOnInit(): void {

  }
  save(): void {
    this.modalCtrl.dismiss(this.croppedImage, 'ok');
  }
  close() {
    this.modalCtrl.dismiss();
  }

  fileChangeEvent(event: any): void {
    this.loading = true;
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    this.loading = false;
  }

  loadImageFailed() {
    console.error('Load image failed');
  }




  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
    this.cd.detectChanges();
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
    this.cd.detectChanges();

  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

  toggleAspectRatio() {
    this.aspectRatio = this.aspectRatio === 4 / 3 ? 16 / 5 : 4 / 3;
  }
}
