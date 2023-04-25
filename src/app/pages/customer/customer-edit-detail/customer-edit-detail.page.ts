import { UtilsService } from '../../../core/services/utils/utils.service';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Customer } from '../../../core/models/customer/customer.model';
import { Component, ElementRef, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { IonIntlTelInputModel, IonIntlTelInputValidators } from 'ion-intl-tel-input';
import { BookingService } from 'src/app/core/services/booking/booking.service';
import { Booking } from 'src/app/core/models/reservation.model';
import { BookingTransformer } from 'src/app/core/transformers/booking.transformer';
import { UploadService } from 'src/app/core/services/upload/upload.service';
import { getTime } from 'date-fns';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { catchError, of, Subscription } from 'rxjs';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { CommerceService } from 'src/app/core/services/commerce/commerce.service';

@Component({
  selector: 'app-customer-edit-detail',
  templateUrl: './customer-edit-detail.page.html',
  styleUrls: ['./customer-edit-detail.page.scss'],
})
export class CustomerEditDetailPage implements OnInit, OnDestroy {

  @ViewChild(AlertComponent) deleteAlert: AlertComponent;
  @ViewChild('customerLogo', { static: false }) customerLogo: ElementRef<HTMLElement>;

  customer: Customer;
  customerForm: FormGroup;
  isEdit = false;
  title = 'Crear cliente';
  defaultImage = '/assets/no-image.jpeg';
  commerceLogged: Commerce;
  isNewBooking: boolean;
  isNewPayment: boolean;
  customerBookings: Booking[] = [];
  id: string;
  phone: IonIntlTelInputModel = {
    dialCode: '+34',
    internationalNumber: '',
    isoCode: 'es',
    nationalNumber: ''
  };
  formValue = { phoneNumber: this.phone };
  imageFile: File;
  imageChanged = false;
  subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private alertController: AlertController,
    private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private bookingService: BookingService,
    private uploadService: UploadService,
    private commerceService: CommerceService
  ) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentCommerce'));
    this.initForms();
    if (this.router.getCurrentNavigation().extras.state) {
      if (this.router.getCurrentNavigation().extras.state.customer) {
        this.customer = this.router.getCurrentNavigation().extras.state.customer;
        this.title = 'Ficha de cliente';
        this.isEdit = true;
      }
      if (this.router.getCurrentNavigation().extras.state.isNewPayment) {
        this.isNewPayment = this.router.getCurrentNavigation().extras.state.isNewPayment;
        this.title = 'Crear cliente';
      }
      if (this.router.getCurrentNavigation().extras.state.isNewBooking) {
        this.isNewBooking = this.router.getCurrentNavigation().extras.state.isNewBooking;
        this.title = 'Crear cliente';
      }
    } else {
      this.title = 'Crear cliente';
    }
  }

  get phoneNumber() { return this.customerForm.get('phone'); }

  get email() { return this.customerForm.get('email'); }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getParam();
  }

  getParam() {
    if (this.activatedRoute.snapshot.params.id) {
      this.title = 'Editar cliente';
      this.subscription.add(this.activatedRoute.params.subscribe((res: Params) => {
        this.id = res.id;
        this.initForms();
        this.getCustomerById(this.id);
        this.isEdit = true;
      }));
    } else {
      this.title = 'Crear cliente';
      this.initForms();
    }
  }

  getCustomerById(uuid: string) {
    this.subscription.add(this.customerService.getCustomerById(uuid).subscribe((res: Customer) => {
      this.customer = res;
      this.setCustomerValue();
    }));
  }

  initForms() {
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [this.formValue.phoneNumber,
      [Validators.required,
      IonIntlTelInputValidators.phone]
      ],
      photo: [''],
      isBlockedByCommerce: [false]
    });
  }

  setCustomerValue() {
    const customerPhone: IonIntlTelInputModel = {
      dialCode: '+34',
      internationalNumber: '',
      isoCode: 'es',
      nationalNumber: this.customer.phone
    };
    this.phoneNumber.setValue(customerPhone);
    this.customerForm.get('name').setValue(this.customer.name);
    this.customerForm.get('lastname').setValue(this.customer.lastname);
    this.customerForm.get('email').setValue(this.customer.email);
    this.customerForm.get('photo').setValue(this.customer.photoURL);
    const isBlockedByCommerce = this.commerceLogged.bannedCustomers.find(customer => customer.uuid === this.customer.uuid);
    if (isBlockedByCommerce) {
      this.customerForm.get('isBlockedByCommerce').setValue(true);
    }
  }

  async getImage() {
    let optionSelected = '';
    const buttons = [
      {
        text: 'Hacer foto',
        icon: 'camera',
        handler: async () => {
          optionSelected = 'camera';
          await this.selectImageFromDevice(optionSelected);
        },
      },
      {
        text: 'Seleccionar de la galería',
        icon: 'image',
        handler: async () => {
          optionSelected = 'gallery';
          await this.selectImageFromDevice(optionSelected);
        },
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'destructive',
        handler: () => { },
      },
    ];
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccionar avatar',
      buttons
    });
    await actionSheet.present();
  }



  saveCustomer() {
    const customer: Customer = this.createCustomerModel();
    if (this.isEdit) {
      if (this.customerForm.get('isBlockedByCommerce').value) {
        this.commerceLogged.bannedCustomers.push(customer);
        this.updateCommerceBannedList();
      } else {
        this.commerceLogged.bannedCustomers.splice(this.commerceLogged.bannedCustomers.findIndex(cus => cus.uuid === customer.uuid), 1);
        this.updateCommerceBannedList();
      }
      this.subscription.add(this.customerService.updateCustomer(customer).subscribe((response) => {
        if (response) {
          this.cancel();
        }
      }));
      if (this.imageChanged) {
        this.subscription.add(this.uploadService.sendUploadImage(this.imageFile, 'customers', customer.uuid).subscribe());
      }
    } else {
      this.subscription.add(this.customerService.saveCustomer(customer).subscribe(async (response) => {
        if (response.message === 'Ya existe un cliente con ese email') {
          const alert = await this.alertController.create({
            header: 'Este usuario ya es usuario de Yeasy',
            subHeader: '¿Desea añadirlo a su lista?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',

              },
              {
                text: 'Sí',
                role: 'confirm',
                handler: () => {
                  this.getCustomerAndBook();
                },
              },
            ],
          });

          await alert.present();

          const { role } = await alert.onDidDismiss();
        }
        else {
          if (this.customerForm.get('isBlockedByCommerce').value) {
            this.commerceLogged.bannedCustomers.push(customer);
            this.updateCommerceBannedList();
          }
          if (this.imageChanged) {
            this.subscription.add(this.uploadService.sendUploadImage(this.imageFile, 'customers', response.uuid).subscribe());
          }
          this.cancel(response);
        }
      }));
    }
  }

  getCustomerAndBook() {
    this.customerService.getCustomerByEmail(this.email.value).subscribe((customer) => {
      customer.createdBy = this.commerceLogged.uuid;
      this.customerService.updateCustomer(customer).subscribe(res => {
        this.navCtrl.back();

      });
    });
  }

  updateCommerceBannedList() {
    this.commerceService.saveCommerceBanned(this.commerceLogged).subscribe();
    localStorage.setItem('currentCommerce', JSON.stringify(this.commerceLogged));
  }

  createCustomerModel(): Customer {
    const customer = new Customer();
    if (this.isEdit) { customer.uuid = this.customer.uuid; }
    customer.name = this.customerForm.get('name').value;
    customer.lastname = this.customerForm.get('lastname').value;
    customer.email = this.customerForm.get('email').value;
    customer.phone = this.customerForm.get('phone').value.internationalNumber.replace(/\s/g, '');
    if (!this.isEdit) {
      customer.password = this.utilsService.generateRandomPassword();
    }
   
    customer.createdBy = this.commerceLogged.uuid;
    customer.createdByCommerce = true;
    return customer;

  }

  getCustomerBookings(commerceUuid: string, customerUuid: string) {
    this.subscription.add(this.bookingService.findBookingsByCommerceAndCustomer(commerceUuid, customerUuid)
      .subscribe((bookings) => {
        this.customerBookings = [...BookingTransformer.from(bookings)];
      }));
  }
  goToBookingDetail(booking: Booking) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activatedRoute,
      state: { booking, isFromCustomerPage: true }
    };
    this.navCtrl.navigateForward([`booking/${booking.uuid}`], navigationExtras);
  }

  onFocus(event) {
    event.target.parentElement.classList.add('fill-input');
  }

  onBlur(event) {
    // Si tiene contenido el input no se la quitamos
    if (!event.target.value) {
      event.target.parentElement.classList.remove('fill-input');
    }
  }

  cancel(customer?: Customer) {
    if (this.isNewBooking) {
      const navExtra: NavigationExtras = {
        queryParams: { newCustomer: JSON.stringify(customer) },
        state: { newCustomer: customer }
      };
      this.navCtrl.navigateBack('tabs/home/new-booking', navExtra);
    } else if (this.isNewPayment) {
      const navExtra: NavigationExtras = {
        queryParams: { newCustomer: JSON.stringify(customer) },
        state: { newCustomer: customer }
      };
      this.navCtrl.navigateBack('tabs/payments', navExtra);
    } else {
      this.navCtrl.back();
    }
  }
  async selectImageFromDevice(optionSelected: string) {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: optionSelected === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      promptLabelHeader: 'Selecciona una imagen',
      promptLabelPicture: 'Haz una foto',
      promptLabelPhoto: 'Desde la galería',
      promptLabelCancel: 'Cancelar'
    });

    const imageBlob = this.utilsService.convertBase64ToBlob(image.dataUrl);
    const filename = this.utilsService.generateRandomFileName(`yeasy_${getTime(new Date())}.png`);
    this.imageFile = new File([imageBlob], `${filename}`, { type: imageBlob.type });
    const reader = new FileReader();
    reader.readAsDataURL(this.imageFile);
    reader.onload = (event) => {
      this.imageChanged = true;
      this.customer.photoURL = reader.result as string;
      this.customerForm.get('photo').setValue(this.imageFile.name);
    };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
