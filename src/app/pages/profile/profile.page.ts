import { ActionSheetController, ModalController, NavController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { CommerceService } from 'src/app/core/services/commerce/commerce.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { UploadService } from 'src/app/core/services/upload/upload.service';
import { getTime } from 'date-fns';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductService } from 'src/app/core/services/product/product.service';
import { Product } from 'src/app/core/models/product/product.model';
import { CropImgComponent } from 'src/app/shared/components/crop-img/crop-img.component';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [InAppBrowser],
})
export class ProfilePage implements OnDestroy {
  productAlert = new BehaviorSubject<boolean>(false);
  options = [
    {
      name: 'Mi perfil ',
      icon: 'person-outline',
      description: 'Edita tu perfil como empleado',
      path: 'edit-my-profile',
      isExternal: false,
      permission: 'none'
    },
    {
      name: 'Información del negocio',
      icon: 'storefront-outline',
      description: 'Gestiona y encuentra toda la información de tu negocio',
      path: 'commerce-info',
      permission: 'configuracion',
      isExternal: false,
      disabled: false
    },
    {
      name: 'Resumen de transacciones',
      icon: 'receipt-outline',
      description: 'Comprueba la lista de tus ventas diarias y semanales',
      path: 'billing',
      permission: 'ventas',
      isExternal: false,
      disabled: false
    },
    {
      name: 'Servicios',
      icon: 'cut-outline',
      description: 'Gestiona los servicios que ofreces en tu comercio',
      path: 'services',
      permission: 'configuracion',
      isExternal: false,
      disabled: false
    },
    {
      name: 'Control de almacén',
      icon: 'pricetag-outline',
      description: 'Gestiona los productos que vendes en tu comercio',
      path: 'products',
      permission: 'configuracion',
      hasAlert: this.productAlert,
      isExternal: false,
      disabled: false
    },
    {
      name: 'Marketing',
      icon: 'megaphone-outline',
      description: 'Crea y personaliza promociones para impulsar tu negocio',
      path: 'marketing',
      permission: 'marketing',
      isExternal: false,
      disabled: false
    },
    {
      name: 'Envío SMS',
      icon: 'megaphone-outline',
      description: 'Envia mensajes másivos por SMS a sus clientes',
      path: 'sms',
      permission: 'sms',
      isExternal: false,
      disabled: false
    },
    {
      name: 'Estadísticas & Informes',
      icon: 'stats-chart-outline',
      description: 'Analiza tus ventas mediante gráficas e informes',
      path: 'stadistics',
      permission: 'estadisticas',
      isExternal: false,
      disabled: false
    },
    {
      name: 'Formación Yeasy',
      icon: 'play-outline',
      description: 'Videos de formación exclusivos impartidos por profesionales del sector',
      path: 'training',
      permission: 'formacion',
      isExternal: false,
      disabled: false
    },
    {
      name: 'Ayuda',
      icon: 'help-circle-outline',
      description: 'Encuentra las preguntas y respuestas más frecuentes acerca de Yeasy',
      path: 'faq',
      permission: 'faq',
      isExternal: false,
      disabled: false
    },
    {
      name: 'Soporte',
      icon: 'information-circle-outline',
      description: 'Obtén ayuda acerca de cualquier duda o problema a traves del chat de Yeasy',
      path: 'support',
      permission: 'soporte',
      isExternal: false,
      disabled: false
    },
    {
      name: 'Política de privacidad',
      icon: 'book-outline',
      description: 'Consulta la política de privacidad de Yeasy',
      path: 'https://yeasy.es/politica-privacidad/',
      permission: 'rgpd',
      isExternal: true,
      disabled: false
    },
    {
      name: 'Yeah! Asistente virtual',
      icon: 'rocket-outline',
      description: 'Tu asesor virtual de última generación ya está trabajando.',
      path: 'machine-learning',
      permission: 'marketing',
      isExternal: false,
      disabled: false
    },
    {
      name: 'Bolsa de trabajo',
      icon: 'bag-outline',
      description: 'Procesando...',
      path: 'rgpd',
      permission: 'configuracion',
      isExternal: false,
      disabled: true
    },
    {
      name: 'Control de asistencias ',
      icon: 'time-outline',
      description: 'Procesando...',
      path: 'rgpd',
      permission: 'configuracion',
      isExternal: false,
      disabled: true
    },
    /* {
      name: 'Facturación comercio',
      icon: 'text-outline',
      description: 'Genera tu facturas',
      path: 'test-billing',
      permission: 'configuracion',
      disabled: false
    } */
    /* {
      name: 'Configuración',
      icon: 'cog-outline',
      description: 'Personaliza Yeasy a tu gusto en función de tus necesidades',
      path: 'config',
      permission: 'configuracion'
    } */
  ];

  optionsFiltered = [];
  currentUser: Employee;
  commerce: Commerce;
  subscription: Subscription = new Subscription();

  constructor(
    private navCtrl: NavController,
    private commerceService: CommerceService,
    public authService: AuthService,
    private actionSheetController: ActionSheetController,
    private utilsService: UtilsService,
    private cd: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private inAppBrowser: InAppBrowser,
    private productService: ProductService,
    private uploadService: UploadService) {
    this.optionsFiltered = this.options;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }


  ionViewWillEnter() {
    this.getCommerceData();
    this.getProductsByCommerce();
  }

  getProductsByCommerce() {
    this.subscription.add(this.productService.getByCommerce(this.currentUser.commerce).subscribe((response: Product[]) => {
      this.productAlert.next(response.some((item: Product) => item.qty < 4));
      this.cd.detectChanges();
    }));
  }

  getCommerceData() {
    this.subscription.add(this.commerceService.getCommerceInfoById(this.currentUser.commerce).subscribe((data: Commerce) => {
      this.commerce = data;
      localStorage.setItem('currentCommerce', JSON.stringify(data));
    }));
  }
  openInAppWebsite(url: string) {

    this.inAppBrowser.create(url, '_system');
  }

  goTo(item: any) {
    if (item.isExternal) {
      this.openInAppWebsite(item.path);
    } else {

      if (item.path === 'login') {
        this.authService.logout();
      } else {
        this.navCtrl.navigateForward([`tabs/profile/${item.path}`], { state: { commerce: this.commerce } });
      }
    }
  }

  async selectCommerceImage(from: string) {
    let optionSelected = '';
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Hacer foto',
          icon: 'camera-outline',
          role: 'camera',
          handler: async () => {
            optionSelected = 'camera';
            await this.selectImageFromDevice(optionSelected, from);
          },
        },
        {
          text: 'Seleccionar de la galería',
          icon: 'image-outline',
          role: 'gallery',
          handler: async () => {
            optionSelected = 'gallery';
            await this.selectImageFromDevice(optionSelected, from,);
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      let featureImage = this.commerce.featureImage;
      let logoImage = this.commerce.logo;
      const imageBlob = this.utilsService.convertBase64ToBlob(data);
      if (from === 'background') {
        const filename = this.utilsService.generateRandomFileName(`yeasy_${getTime(new Date())}_background.png`);
        const imageFile = new File([imageBlob], `${filename}`, { type: imageBlob.type });
        this.subscription.add(this.uploadService.sendUploadCommerceBackgroundImage(imageFile, 'commerce', this.commerce.uuid).subscribe(response => {
          if (response) {
            const base64Data = image.dataUrl;
            featureImage = imageFile.name;
            const commerceImage = document.getElementById('commerceImage');
            commerceImage.style.backgroundImage = `url(${base64Data})`;
            commerceImage.style.backgroundSize = 'cover';
            commerceImage.style.backgroundRepeat = 'no-repeat';
            commerceImage.style.backgroundPosition = 'center';
            this.uploadCommerce(featureImage, logoImage);
          }
        }));
      } else {
        const filename = this.utilsService.generateRandomFileName(`yeasy_${getTime(new Date())}_logo.png`);
        const imageFile = new File([imageBlob], `${filename}`, { type: imageBlob.type });
        this.subscription.add(this.uploadService.sendUploadCommerceLogoImage(imageFile, 'commerce', this.commerce.uuid).subscribe(response => {
          if (response) {
            const base64Data = image.dataUrl;
            const commerceLogo: any = document.getElementById('commerceLogo');
            commerceLogo.src = base64Data;
            logoImage = imageFile.name;
            this.uploadCommerce(featureImage, logoImage);
          }
        }));
      }
    }
  }

  private uploadCommerce(featureImage: string, logoImage: string) {
    const commerceToSave: Commerce = new Commerce();
    commerceToSave.uuid = this.commerce.uuid;
    commerceToSave.featureImage = featureImage;
    commerceToSave.logo = logoImage;
    this.subscription.add(this.commerceService.saveCommerce(commerceToSave).subscribe(res => this.getCommerceData()
    ));
  }

  private async selectImageFromDevice(optionSelected: string, from: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: optionSelected === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      promptLabelHeader: 'Selecciona una imagen',
      promptLabelPicture: 'Haz una foto',
      promptLabelPhoto: 'Desde la galería',
      promptLabelCancel: 'Cancelar'
    });
    const imageBlob = this.utilsService.convertBase64ToBlob(image.dataUrl);
    this.openModal(imageBlob, from);
  }

}
