import { UtilsService } from './../../../../core/services/utils/utils.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { ServiceDto } from 'src/app/core/dto/service.dto';
import { ServiceCategoryDto } from 'src/app/core/dto/serviceCategory.dto';
import { ICategoryService } from 'src/app/core/interfaces/category-service.interface';
import { IService } from 'src/app/core/interfaces/services.interface';
import { ServicesService } from 'src/app/core/services/services/services.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { ColorListComponent } from 'src/app/shared/components/color-list/color-list.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-services-item',
  templateUrl: './services-item.page.html',
  styleUrls: ['./services-item.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesItemPage implements OnInit, OnDestroy {
  @ViewChild(AlertComponent) deleteAlert: AlertComponent;

  serviceForm: FormGroup;
  categoryCollection: ICategoryService[] = [];
  service: IService;
  isEdit = false;
  commerceLogged: string;
  title: string;
  isCategoryModalOpen = false;
  newCategory: string;
  isFromWizard = false;
  orderNumber: ICategoryService[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private servService: ServicesService,
    private navCtrl: NavController,
    private utilsService: UtilsService,
    private cd: ChangeDetectorRef) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;

    if (this.router.getCurrentNavigation().extras.state.service) {
      this.service = this.router.getCurrentNavigation().extras.state.service;

      this.isEdit = true;
      this.title = 'Editar servicio';
      this.isFromWizard = this.router.getCurrentNavigation().extras.state.isFromWizard;

    } else {


      this.orderNumber = this.router.getCurrentNavigation().extras.state.orderNumber

      this.title = 'Crear servicio';


    }
  }


  get name() {
    return this.serviceForm.get('name');
  }
  get price() {
    return this.serviceForm.get('price');
  }
  get category() {
    return this.serviceForm.get('category');
  }
  get color() {
    return this.serviceForm.get('color');
  }
  get duration() {
    return this.serviceForm.get('duration');
  }

  get isPublic() {
    return this.serviceForm.get('isPublic');
  }


  @HostListener('touchmove', ['$event'])
  onTouchMove() {

    const selection = window.getSelection();
    selection.removeAllRanges();
  }


  ngOnInit() {

  }
  ionViewWillEnter() {
    this.findCategoryByCommerce();
  }
  dismissModal(modalId: string) {
    const modal: any = document.getElementById(modalId);
    if (modal) { modal.dismiss(); }
  }
  onChangeDuration(value) {
    if (value !== undefined) {
      this.duration.setValue(value);
    }
  }
  findCategoryByCommerce() {
    this.subscription.add(this.servService.findServiceCategoryByCommerce(this.commerceLogged).subscribe((res: ICategoryService[]) => {
      this.categoryCollection = [...res];
      this.initForm();
      if (this.service) {

        this.name.setValue(this.service.name);
        this.price.setValue(this.service.price);
        this.category.setValue(this.service.category.uuid);
        this.color.setValue(this.service.color);
        this.isPublic.setValue(this.service.isPublic);
      } else {
        this.category.setValue(this.categoryCollection[0]?.uuid);
      }
      this.cd.detectChanges()
    }));
  }
  createNewCategory() {
    const newCategoryDto: ServiceCategoryDto = new ServiceCategoryDto();
    newCategoryDto.name = this.newCategory;
    newCategoryDto.commerce = this.commerceLogged;
    this.subscription.add(this.servService.createCategoryService(newCategoryDto).subscribe((res: ICategoryService) => {
      this.categoryCollection.push(res);
      this.isCategoryModalOpen = false;
      this.category.setValue(res.uuid);
      this.newCategory = '';
    }));
  }
  selectedCategory(event) {
    if (event === null) {
      this.isCategoryModalOpen = true;
    } else {
      this.category.setValue(event);
    }
  }
  setOpen(value: boolean) {
    this.isCategoryModalOpen = value;
  }
  checkIfDurationIsMoreThanZero(): boolean {
    return this.duration.value !== '00:00' && this.duration.value !== '0:0';
  }
  initForm(): void {
    this.serviceForm = this.fb.group({
      name: [this.service ? this.service.name : '', Validators.required],
      category: [this.service ? this.service.category.uuid : ''],
      price: [this.service ? this.service.price : '', Validators.required],
      color: [this.service ? this.service.color : '', Validators.required],
      isPublic: [this.service ? this.service.isPublic : true],
      duration: [this.service && this.service.defaultDuration
        ? this.formatMinutesToHoursFormatted(this.service.defaultDuration)
        : '00:00', [Validators.required]]
    });

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

  formatPrice(event) {
    let price: string = event.detail.value;
    if (price) {
      if (price.includes('.')) {
        const index = price.indexOf('.');
        price = price.substring(0, index + 3);
      }
      this.serviceForm.get('price').setValue(price);
    }
  }

  onChange(event) {
    if (event.detail.value) {
      const durationParsed = Number.parseInt(event.detail.value, 10);
      if (isNaN(durationParsed)) {
        this.serviceForm.get('duration').setValue(durationParsed.toString());
      }
    }
  }


  openAlert() {
    this.deleteAlert.presentAlertConfirm();
  }

  submit() {
    const serviceDto: ServiceDto = new ServiceDto();
    serviceDto.commerce = this.commerceLogged;
    serviceDto.name = this.name.value;
    serviceDto.price = this.price.value;
    serviceDto.category = this.category.value;
    serviceDto.defaultDuration = this.utilsService.transformHourStringIntoMinutes(this.duration.value);
    serviceDto.color = this.color.value;
    serviceDto.isPublic = this.isPublic.value;

    if (this.isEdit) {
      serviceDto.uuid = this.service.uuid;
    } else {
      const cat = this.orderNumber.find(c => c.uuid === this.category.value);
      if (!cat) {
        serviceDto.order = 1;
      } else {
        serviceDto.order = cat?.services.length + 1;
      }

    }
    this.subscription.add(this.servService.createService(serviceDto).subscribe(
      (res: IService) => {
        if (res) {
          this.cancel();
        }
      }
    ));
  }
  cancel() {
    this.navCtrl.back();
  }
  alertBox(value: boolean) {
    if (value) {
      this.deleteItem();
    }
  }
  deleteItem() {
    this.subscription.add(this.servService.deleteService(this.service).subscribe(res => {
      this.cancel();
    }));
  }
  async presentColorsModal() {
    const modal = await this.modalController.create({
      component: ColorListComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data !== undefined) {
      if (this.isEdit) {
        this.service.color = data.color;
      }
      this.color.setValue(data.color);
    }
  }

  formatMinutesToHoursFormatted(minutes: number): string {
    if (minutes < 60 && minutes > 9) {
      return '00:' + minutes;
    }
    if (minutes < 10) {
      return '00:0' + minutes;
    }
    if (minutes >= 60) {
      const hour = minutes / 60;

      const values = hour.toPrecision().split('.');
      const float = hour - parseInt(values[0], 10);
      if (parseInt(values[0], 10) < 10) {
        return '0' + parseInt(values[0], 10) + ':' + Math.round(60 * float);
      } else {

        return parseInt(values[0], 10) + ':' + Math.round(60 * float);
      }

    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
