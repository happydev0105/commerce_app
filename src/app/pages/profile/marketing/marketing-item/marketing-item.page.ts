import { UploadService } from 'src/app/core/services/upload/upload.service';
import { Review } from 'src/app/core/models/review/review.model';
import { Employee } from './../../../../core/models/employee/employee.model';
import { CommerceService } from './../../../../core/services/commerce/commerce.service';
import { Commerce } from './../../../../core/models/commerce/commerce.model';
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ToastService } from './../../../../core/services/toast/toast.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { AlertController, Platform, IonRouterOutlet, NavController, IonImg, isPlatform, ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { FileSharer } from '@byteowls/capacitor-filesharer';
import html2canvas from 'html2canvas';
import { Media, MediaAlbum } from '@capacitor-community/media';
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Keyboard } from '@capacitor/keyboard';

gsap.registerPlugin(Draggable);

interface Text {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  font: string;
  color: string;
}

@Component({
  selector: 'app-marketing-item',
  templateUrl: './marketing-item.page.html',
  styleUrls: ['./marketing-item.page.scss'],
})
export class MarketingItemPage implements OnInit, OnDestroy {

  @ViewChild('imageCanvas', { static: true }) canvas: ElementRef;
  @ViewChild('canvasTarget', { static: false }) canvasTarget: ElementRef;
  @ViewChild('downloadLink', { static: false }) downloadLink: ElementRef;
  @ViewChild('textWritten', { static: false }) textWritten: ElementRef;

  canvasElement: any;
  ctx: any;
  startX: any;
  startY: any;
  offsetX: any;
  offsetY: any;
  // an array to hold text objects
  texts = [];
  // this var will hold the index of the hit-selected text
  selectedText = -1;
  drawing = false;
  lineWidth = 16;
  selectedItem;
  screenWidth = window.screen.width * 0.95;
  textSelected = 'Texto de prueba';
  indexText = 0;
  showTextTools = false;
  MIME_TYPE = 'image/png';
  addIcon = false;
  pos1 = 0;
  pos2 = 0;
  pos3 = 0;
  pos4 = 0;
  elmnt: HTMLElement;
  isDown = false;

  position;
  offset = [0, 0];

  currentCommerce: Commerce;
  currentUser: Employee;
  subscription: Subscription = new Subscription();
  showRating = false;
  review: Review;
  fromGallery = false;
  tempCanvasBackround = '';
  tempLogoCommerceBackround = '';
  isFromReview = false;
  backUrl: string;
  isReady = true;

  constructor(
    private plt: Platform,
    private alertController: AlertController,
    private router: Router,
    private spinnerDialog: SpinnerDialog,
    private actionSheetController: ActionSheetController,
    private toastService: ToastService,
    private routerOutlet: IonRouterOutlet,
    private commerceService: CommerceService,
    private navCtrl: NavController,
    private uploadService: UploadService) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getCommerceData();
    if (this.router.getCurrentNavigation().extras.state) {
      this.fromGallery = this.router.getCurrentNavigation().extras.state.fromGallery;
      this.selectedItem = this.router.getCurrentNavigation().extras.state.selectedItem;
      this.textSelected = this.selectedItem.title;
      if (this.router.getCurrentNavigation().extras.state.review) {

        this.review = this.router.getCurrentNavigation().extras.state.review;
        this.isFromReview = true;
        this.backUrl = 'tabs/profile/commerce-info/reviews';
        this.textSelected = this.review.review;

        setTimeout(() => {
          this.drawStars();
        }, 1000);
      }else {
        this.backUrl = 'tabs/profile/marketing';
      }

    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ionViewWillEnter() {
    
    this.currentCommerce = JSON.parse(localStorage.getItem('currentCommerce'));
  }

  ionViewDidEnter() {
    document.querySelector('#canvasDiv div').classList.add('add-overlay');
    const divtexto = document.getElementById('textWritten');
    divtexto.innerHTML = this.textSelected;
  }

  getCommerceData() {
    this.subscription.add(this.commerceService.getCommerceInfoById(this.currentUser?.commerce).subscribe(response => {
      if (response) {
        localStorage.setItem('currentCommerce', JSON.stringify(response));
        this.currentCommerce = response;
      }
    }));
  }

  ngOnInit() {
    // console.log('tipo orientacion; ', this.screenOrientation.type);
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    let url = this.selectedItem?.image;
    if (this.selectedItem?.image.includes('yeasy')) {
      url = `${environment.server}uploads/images/commerce/${this.currentUser.commerce}/${this.selectedItem?.image}`;
    }
    this.canvasElement = document.getElementById('canvasDiv');
    this.canvasElement.style.backgroundImage = `url(${url})`;
    this.canvasElement.style.backgroundSize = 'cover';
    this.canvasElement.style.backgroundRepeat = 'no-repeat';
    this.canvasElement.style.backgroundPosition = 'center';
    this.routerOutlet.swipeGesture = false;
    this.tempCanvasBackround = this.canvas.nativeElement.style.backgroundImage;
  }

  changeTextSize(event) {
    const size = event.detail.value;
    const textWritten = document.getElementById('textWritten');
    textWritten.style.fontSize = size + 'px';
  }

  draw(text: Text) {
    const newTextDiv = document.createElement('div');
    newTextDiv.id = text.id;
    newTextDiv.style.position = 'absolute';
    newTextDiv.style.left = text.x + 'px';
    newTextDiv.style.top = text.y + 'px';
    newTextDiv.style.width = text.width + 'px';
    newTextDiv.style.height = text.height + 'px';
    newTextDiv.style.color = text.color;
    newTextDiv.style.font = text.font;
    newTextDiv.innerText = text.text;
    this.canvas.nativeElement.appendChild(newTextDiv);
  }

  textHittest(x: number, y: number, textIndex: number): boolean {
    const text = this.texts[textIndex];
    return (x >= text.x && x <= text.x + text.width && y >= text.y - text.height);
  }

  addText() {
    const offset = this.canvasElement.getBoundingClientRect();
    // calc the y coordinate for this text on the canvas
    const y = (this.texts.length * 20);
    // get the text from the input element
    const text: Text = {
      id: this.indexText + '',
      text: this.textSelected,
      x: offset.left + 20,
      y: offset.top + y,
      width: 0,
      height: this.lineWidth,
      font: `${this.lineWidth}px verdana`,
      color: '#fff'
    };
    this.indexText++;
    // calc the size of this text for hit-testing purposes
    text.width = text.text.length * this.lineWidth;
    // put this new text in the texts array
    this.texts.push(text);
    // redraw everything
    this.draw(text);
    this.textSelected = '';
  }

  saveImage() {
    this.spinnerDialog.show('Generando imagen...');
    html2canvas(this.canvas.nativeElement, { height: 350, width: 350, scale: 3 }).then(async canvas => {
      canvas.toBlob(async (blob) => {
        const fileName = `Yeasy-image-${new Date().getTime()}.png`;
        if (this.plt.is('android')) {

          const customDirectory = this.plt.is('ios') ? Directory.Library : Directory.Documents;
          const base64Data = await this.blobToBase64(blob);

          try {
            await Filesystem.writeFile({
              path: `${customDirectory}/${fileName}`,
              data: base64Data,
              directory: customDirectory,
              recursive: true
            }).then(() => {
              this.toastService.presentToast('Imagen guardada en su galeria', true);
              this.spinnerDialog.hide();
            });
          } catch (error) {
            this.spinnerDialog.hide();
            this.toastService.presentToast('Error al guardar la imagen', false);
          }
        } else if (this.plt.is('ios')) {
          // Handle albums
          const albumName = 'Yeasy-business';
          let albumIdentifier = '';

          let albums = await Media.getAlbums();
          albumIdentifier = albums.albums.find(a => a.name === albumName)?.identifier || null;

          if (!albumIdentifier) {
            // Doesn't exist, create new album
            await Media.createAlbum({ name: albumName });
            albums = await Media.getAlbums();
            albumIdentifier = albums.albums.find(a => a.name === albumName)?.identifier;
          }
          Keyboard.hide();
          Media.savePhoto({
            path: canvas.toDataURL(this.MIME_TYPE),
            album: albumIdentifier
          }).then(response => {

            this.spinnerDialog.hide();
            this.toastService.presentToast('Imagen guardada en su galeria', true);
            Keyboard.hide();
          }).catch(err => {
            this.spinnerDialog.hide();
            this.toastService.presentToast('Error al guardar la imagen', false);
            Keyboard.hide();
          });

        }
      });

    });
    Keyboard.hide();
  }

  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
    });
  }

  async changeBackground(from?: string) {
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
            await this.selectImageFromDevice(optionSelected, from);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'destructive',
        },
      ],
    });
    await actionSheet.present();
  }

  async selectImageFromDevice(optionSelected: string, from: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source:
        optionSelected === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      promptLabelHeader: 'Selecciona una imagen',
      promptLabelPicture: 'Haz una foto',
      promptLabelPhoto: 'Desde la galería',
      promptLabelCancel: 'Cancelar',
    });
    const base64Data = image.dataUrl;
    this.selectedItem.image = base64Data;
    this.canvasElement.style.background = `url(${base64Data})`;
    this.canvasElement.style.backgroundSize = 'cover';
    this.canvasElement.style.backgroundRepeat = 'no-repeat';
    this.canvasElement.style.backgroundPosition = 'center';
  }


  async resetBackground() {
    const alert = await this.alertController.create({
      header: 'Reiniciar imagen',
      message: 'Perderás todos los cambios que hayas realizado hasta ahora',
      buttons: [
        {
          text: 'Cancelar',
          role: 'destructive',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            this.texts = [];
          }
        }
      ]
    });
    await alert.present();
  }


  shareImage(share: boolean) {
    this.spinnerDialog.show('Generando imagen...');
    const backgroundImage: any = document.getElementById('mydivheader');
    const requestCalls: Observable<any>[] = [];

    const urlLogo = this.tempLogoCommerceBackround;
    const splittedUrlLogo = urlLogo.split('/');
    let imagePath = splittedUrlLogo.pop();
    imagePath = imagePath.slice(0, -2);

    const url = this.tempCanvasBackround;
    const splittedUrl = url.split('/');
    let fileName = splittedUrl.pop();
    fileName = fileName.slice(0, -2);

    if (this.fromGallery) {
      requestCalls.push(this.getBase64Image(fileName));
      if (this.addIcon) {
        requestCalls.push(this.getBase64Image(imagePath));
      }
      forkJoin(requestCalls).subscribe(response => {
        this.canvasElement.style.backgroundImage = `url(data:image/png;base64,${response[0].data})`;
        if (response[1]) {
          backgroundImage.style.backgroundImage = `url(data:image/png;base64,${response[1].data})`;
        }
        share ? this.convertImageToCanvas() : this.saveImage();
      });
    } else {
      if (this.addIcon) {
        this.getBase64Image(imagePath).subscribe(response => {
          backgroundImage.style.backgroundImage = `url(data:image/png;base64,${response.data})`;
          share ? this.convertImageToCanvas() : this.saveImage();
        });
      } else {
        share ? this.convertImageToCanvas() : this.saveImage();
      }
    }
    Keyboard.hide();
  }

  getBase64Image(imagePath: string) {
    return this.uploadService.getBase64Image(imagePath, this.currentCommerce.uuid);
  }

  convertImageToCanvas() {
    html2canvas(this.canvas.nativeElement, { logging: true, useCORS: true, height: 350, width: 350,  }).then(async canvas => {
      const imgURL = canvas.toDataURL(this.MIME_TYPE);
      this.selectedItem.image = imgURL;
      const base64Data = this.selectedItem.image.replace(/^data:image\/[a-z]+;base64,/, '');
      FileSharer.share({
        filename: `yeasy_${this.generateRandomFileName()}.png`,
        base64Data,
        contentType: this.MIME_TYPE
      }).then(() => {
        this.spinnerDialog.hide();
      }).catch(error => {
        this.spinnerDialog.hide();
        this.toastService.presentToast('Ha ocurrido un error al guardar la imagen', false);
      });
    }).catch(error => this.spinnerDialog.hide());
  }

  downloadImage() {
    if (this.plt.is('android') || this.plt.is('ios')) {
      this.shareImage(false);
    } else {
      html2canvas(this.canvas.nativeElement).then(canvas => {
        const img = canvas.toDataURL(this.MIME_TYPE);
        this.canvasTarget.nativeElement.src = img;
        this.downloadLink.nativeElement.href = canvas.toDataURL(this.MIME_TYPE);
        this.downloadLink.nativeElement.download = `yeasy_${this.generateRandomFileName()}.png`;
        this.downloadLink.nativeElement.click();
        this.selectedItem.image = img;
        this.toastService.presentToast('Promoción guardada', true);
        this.cancel();
      }, (error) => this.toastService.presentToast('Error al guardar la imagen', false));
    }
  }

  drawIcon() {
    this.addIcon = !this.addIcon;
    Draggable.create('#mydiv', {
      bounds: document.getElementById('canvasDiv'),
      inertia: true
    });
    this.tempLogoCommerceBackround = document.getElementById('mydivheader').style.backgroundImage;
  }

  drawStars() {
    this.showRating = true;
  }

  checkLength(ev: any) {
    if (this.textWritten.nativeElement.innerText.length > 200) {
      this.textWritten.nativeElement.innerText = this.textSelected;

    } else {
      this.textSelected = this.textWritten.nativeElement.innerText;
    }

  }

  resetImagePosition() {
    const draggableDiv = document.getElementById('mydiv');
    draggableDiv.style.position = 'absolute';
    draggableDiv.style.width = '25px';
    draggableDiv.style.height = '25px';
    draggableDiv.style.margin = '10px';
    draggableDiv.style.left = '';
    draggableDiv.style.top = '';
  }


  typeText(event) {
    const divtexto = document.getElementById('textWritten');
    divtexto.innerHTML = event.target.value;
    event.target.value === ''
      ? document.querySelector('#canvasDiv div').classList.remove('add-overlay')
      : document.querySelector('#canvasDiv div').classList.add('add-overlay');
  }

  generateRandomFileName(): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < charactersLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  cancel() {
    const navigationExtras: NavigationExtras = { replaceUrl: true };
    this.navCtrl.navigateBack(['tabs/profile/marketing'], navigationExtras);
  }

  range(start: number, end: number) {
    return Array.from({ length: (end - start) + 1 }, (_, i) => start + i);
  }
 ionViewWillLeave(){
   this.isReady = false;
   this.textSelected = null;
   this.review = null;
   this.selectedItem = null;

 }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
