import { Router } from '@angular/router';
/* eslint-disable max-len */
import { StaticGalleryComponent } from './../../../shared/components/static-gallery/static-gallery.component';
import { ReviewListComponent } from './../../../shared/components/review-list/review-list.component';
import { ActionSheetController, NavController, ModalController, IonRouterOutlet, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GalleryListComponent } from 'src/app/shared/components/gallery-list/gallery-list.component';
import { Review } from 'src/app/core/models/review/review.model';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { Employee } from 'src/app/core/models/employee/employee.model';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.page.html',
  styleUrls: ['./marketing.page.scss'],
})
export class MarketingPage implements OnInit {

  marketingTextCollection: string[] = [];
  marketingItems = [];
  stepImage = false;
  title = '¿Qué texto desea compartir?';
  textSelected = '';
  reviewSelected: Review;
  shareYourWorkItem = {
    title: 'Comparte tu trabajo',
    image: ''
  };
  currentUser: Employee;
  commerce: Commerce;
  review: Review;
  isFromReview = false;
  backUrl: string;

  constructor(
    private navCtrl: NavController,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private alertController: AlertController,
    private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.router.getCurrentNavigation().extras.state) {
      this.commerce = this.router.getCurrentNavigation().extras.state.commerce;
      if (this.router.getCurrentNavigation().extras.state.review) {
        this.review = this.router.getCurrentNavigation().extras.state.review;
        this.isFromReview = true;
        this.backUrl = 'tabs/profile/commerce-info/reviews';
        this.textSelected = this.review.review;
        this.reviewSelected = this.review;
        this.stepSelectImage(this.textSelected);
      }else{
        this.backUrl = 'tabs/profile/marketing';
      }

    }
  }

  ionViewWillEnter() {
    this.marketingItems = [];
    this.marketingTextCollection = [];
    this.textSelected = '';
    this.marketingItems.push(
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
    this.marketingTextCollection.push(
      'Compartir una reseña',
      '¿Necesitas una cita urgentemente? ¡Pásate por Yeasy y resérvala!',
      '¡Tenemos nuevos productos disponibles! Pregunta por ellos cuando vengas a visitarnos.',
      'Ahora tenemos nuevos servicios disponibles, puedes verlos en Yeasy.',
      'En Yeasy puedes ver todos nuestros servicios, ¡visítanos y coge tu cita!',
      'Nunca ha sido tan fácil reservar una cita en cualquier lugar y a cualquier hora, puedes reservar 24/7 con nosotros a través de Yeasy.',
      'No llames más por teléfono, ahora puedes reservar tu cita muy fácil a través de Yeasy.',
      '¡Hay citas disponibles para hoy! Puedes encontrarnos en Yeasy y reservar tu cita ahora mismo.',
      'Nos vamos de vacaciones, si quieres reservar una cita con nosotros puedes hacerlo ahora a través de Yeasy.');
  }

  ngOnInit() {

  }

  selectText(textSelected: string) {
    if (textSelected.toLowerCase() === 'compartir una reseña') {
      this.presentReviewModal(textSelected);
    } else {
      this.stepSelectImage(textSelected);
    }
  }

  stepSelectImage(textSelected: string) {
    this.stepImage = true;
    this.textSelected = textSelected;
  }

  toggleToText(){
    this.stepImage = false;
  }



  async addOwnText() {
    const alert = await this.alertController.create({
      header: 'Texto personalizado',
      buttons: [{
        text: 'Guardar',
        handler: (data: string[]) => {
          if (data[0].length > 0) {
            this.selectText(data[0]);
          }
        }
      }],
      inputs: [
        {
          value: this.textSelected,
          type: 'textarea',
          attributes: {
            minlength: 1,
            maxlength: 189,
            rows: 8,
            autoGrow: true
          },
          placeholder: 'Escribe tu propio texto...'
        }
      ]
    });
    await alert.present();
  }

  goToCreateMarketingItem(item) {
    
    if (item.title.toLowerCase() === 'comparte tu trabajo') {
      this.presentGalleryModal();
    } else if (this.reviewSelected) {

      
      item.title = this.textSelected;
      this.stepImage = false;
      this.navCtrl.navigateForward(['tabs/profile/marketing/marketing-item'], { state: { selectedItem: item, fromGallery: false, review: this.reviewSelected }, replaceUrl: true });
    } else {

      item.title = this.textSelected;
      this.stepImage = false;
      this.navCtrl.navigateForward(['tabs/profile/marketing/marketing-item'], { state: { selectedItem: item, fromGallery: false, review: null }, replaceUrl: true });
    }
  }
  
  async presentStaticGalleryModal(selectedItem) {
    const modal = await this.modalController.create({
      component: StaticGalleryComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      const fromGallery = data.fromGallery;
      selectedItem.image = data.selectedItem.image;
      this.stepImage = false;

      this.navCtrl.navigateForward(['tabs/profile/marketing/marketing-item'], { state: { selectedItem, fromGallery }, replaceUrl: true });
    }
  }

  async presentReviewModal(textSelected: string) {
    const modal = await this.modalController.create({
      component: ReviewListComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.reviewSelected = data.review;
      textSelected = data.review.review;
      this.stepSelectImage(textSelected);
    }
  }

  async presentGalleryModal() {
    const modal = await this.modalController.create({
      component: GalleryListComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      const fromGallery = data.fromGallery;
      const selectedItem = this.shareYourWorkItem;
      selectedItem.title = this.textSelected;
      selectedItem.image = data.selectedImage;
      if (this.reviewSelected) {
        this.stepImage = false;
  
      
      this.navCtrl.navigateForward(['tabs/profile/marketing/marketing-item'], { state: { selectedItem, fromGallery, review: this.reviewSelected } });
    } else {
       
        this.stepImage = false;
        this.navCtrl.navigateForward(['tabs/profile/marketing/marketing-item'], { state: { selectedItem, fromGallery, review: null }, replaceUrl: true });
      }
    }
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

  private async selectImageFromDevice(optionSelected: string) {
    const item = {
      title: 'Elemento personalizado',
      image: ''
    };
    // Obtener de la galería
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
    const base64Data = image.dataUrl;
    item.image = base64Data;
    this.goToCreateMarketingItem(item);
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
