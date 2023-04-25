/* eslint-disable id-blacklist */
import { ElementRef, OnDestroy } from '@angular/core';
/* eslint-disable guard-for-in */
import { NavController } from '@ionic/angular';
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
import { ScheduleDay } from './../../../../core/interfaces/schedule-day.interface';
import { DateService } from 'src/app/core/utils/date.service';
import { TimeTable } from './../../../../core/models/timeTable/timeTable.model';
import { TimeTableService } from './../../../../core/services/timeTable/time-table.service';
import { TimeTableDto } from './../../../../core/models/timeTable/timeTable.dto.model';
import { EmployeeDto } from './../../../../core/models/employee/employee.dto.model';
import { EmployeeService } from './../../../../core/services/employee/employee.service';
import { ActionSheetController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Employee } from './../../../../core/models/employee/employee.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TimeTableTransformer } from 'src/app/core/transformers/timeTable.transformer';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { Service } from 'src/app/core/models/service.model';
import { ServiceListComponent } from 'src/app/shared/components/service-list/service-list.component';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { Permission } from './../../../../core/models/permission/permission.model';
import { RoleValues } from 'src/app/core/models/enums/role.enum';
import { UpdateTimeTableDayDto } from 'src/app/core/models/timeTable/update-timeTable-day.dto';
import { ServicesService } from 'src/app/core/services/services/services.service';
import { IonIntlTelInputModel, IonIntlTelInputValidators } from 'ion-intl-tel-input';
import { UploadService } from 'src/app/core/services/upload/upload.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getTime } from 'date-fns';
import { forkJoin, Subscription } from 'rxjs';
import { CropImgComponent } from 'src/app/shared/components/crop-img/crop-img.component';
import { Clipboard } from '@capacitor/clipboard';
import { ToastService } from 'src/app/core/services/toast/toast.service';
export interface OpeningHours {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.page.html',
  styleUrls: ['./employee-detail.page.scss'],
})
export class EmployeeDetailPage implements OnInit, OnDestroy {
  @ViewChild(AlertComponent) deleteAlert: AlertComponent;
  @ViewChild('employeeLogo', { static: false }) employeeLogo: ElementRef<HTMLElement>;
  employee: Employee;
  timeTableFromEmployee: TimeTable;
  timeTableFromCommerce: ScheduleDay;
  employeeForm: FormGroup;
  timeTableForm: FormGroup;
  defaultImage = '';
  openingHours: OpeningHours;
  closingHours: OpeningHours;
  commerceLogged: string;
  serviceSelected: Service[] = [];
  schedule: ScheduleDay;
  timetableText = 'Ver horario';
  servicesText = 'Ocultar servicios seleccionados';
  serviceCollection: Service[] = [];
  weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  isEdit: boolean;
  selectedRole = { name: 'Empleado', value: 'empleado' };
  orderNumber: Employee[] = [];
  selectedPermission: Permission[] = [];

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
  image = '/assets/no-image.jpeg';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private actionSheetCtrl: ActionSheetController,
    private employeeService: EmployeeService,
    private timeTableService: TimeTableService,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private serviceService: ServicesService,
    private dateService: DateService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private uploadService: UploadService,
    private toastService: ToastService,
    private utilsService: UtilsService
  ) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
    this.initForms();
    if (this.router.getCurrentNavigation().extras.state.employee) {
      this.isEdit = true;
      this.employee = this.router.getCurrentNavigation().extras.state.employee;
      this.serviceSelected = this.employee.services ? this.employee.services : [];

      this.getTimeTableByEmployee();
      this.initEmployeeForm();
      this.getRole();
    } else {
      this.getTimeTableFromCommerce();
      this.isEdit = false;
      this.orderNumber = this.router.getCurrentNavigation().extras.state.orderNumber;
    }
    this.subscription.add(this.timeTableService.updateHourday$.subscribe(response => {
      this.setDefaultHours(response);
    }));
    this.subscription.add(this.timeTableService.updateHourDayNewEmployee$.subscribe(response => {
      this.setNewHourDay(response);
    }));
  }



  get phoneNumber() { return this.employeeForm.get('phone'); }
  get isEmployee() { return this.employeeForm.get('isEmployee').value; }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ngOnInit() {
    this.getTimeTableFromCommerceWithoutSeHours();
    this.getAllService();
  }

  getAllService() {
    this.subscription.add(this.serviceService
      .findServiceByCommerce(this.commerceLogged)
      .subscribe((res: Service[]) => {
        this.serviceCollection = res;
      }));
  }

  getRole() {
    const rolesFromEnum = Object.values(RoleValues);
    rolesFromEnum.forEach(item => {
      if (JSON.parse(item).value === this.employee.role) {
        this.selectedRole = JSON.parse(item);
      }
    });
    this.employeeForm.get('role').setValue(this.selectedRole.value);
  }


  ionViewWillEnter() {
    const storedSelectedRole = JSON.parse(localStorage.getItem('selectedRole'));
    const storedPermissions = JSON.parse(localStorage.getItem('selectedPermission'));
    if (storedSelectedRole) {
      this.selectedRole = storedSelectedRole;
      this.employeeForm.get('role').setValue(this.selectedRole.value);
    }
    if (storedPermissions) {
      this.selectedPermission = storedPermissions;
    }
  }

  ionViewWillLeave() {
    localStorage.removeItem('selectedRole');
    localStorage.removeItem('selectedPermission');
  }

  setChekinAndDepartureHoursFromCommerce() {
    const days = Object.keys(this.openingHours);
    days.forEach(day => {
      if (this.openingHours[day].length > 0) {
        this.timeTableForm.get(`checkinTime${day}`).setValue(this.openingHours[day][0]);
        this.timeTableForm.get(`departureTime${day}`).setValue(this.openingHours[day][this.openingHours[day].length - 1]);
      } else {
        this.timeTableForm.get(day).setValue(false);
      }
    });
  }

  initEmployeeForm() {
    this.employeeForm = this.formBuilder.group({
      name: [this.employee ? this.employee.name : '', Validators.required],
      surname: [this.employee ? this.employee.surname : ''],
      email: [this.employee ? this.employee.email : '', Validators.required],
      phone: [this.formValue.phoneNumber,
      [Validators.required,
      IonIntlTelInputValidators.phone]
      ],
      position: [this.employee ? this.employee.position : '',],
      description: [this.employee ? this.employee.description : '',],
      isActive: [this.employee ? this.employee.isActive : true, Validators.required],
      isEmployee: [this.employee ? this.employee.isEmployee : true],
      image: [this.employee ? this.employee.image : this.defaultImage],
      role: [this.employee ? this.employee.role : this.selectedRole.value, Validators.required]
    });
    if (this.employee) {
      const customerPhone: IonIntlTelInputModel = {
        dialCode: '+34',
        internationalNumber: '',
        isoCode: 'es',
        nationalNumber: this.employee?.phone
      };
      this.phoneNumber.setValue(customerPhone);
    }
  }

  initTimeTableForm() {
    this.timeTableForm = this.formBuilder.group({
      monday: [true, Validators.required],
      checkinTimemonday: ['', Validators.required],
      departureTimemonday: ['', Validators.required],
      tuesday: [true, Validators.required],
      checkinTimetuesday: ['', Validators.required],
      departureTimetuesday: ['', Validators.required],
      wednesday: [true, Validators.required],
      checkinTimewednesday: ['', Validators.required],
      departureTimewednesday: ['', Validators.required],
      thursday: [true, Validators.required],
      checkinTimethursday: ['', Validators.required],
      departureTimethursday: ['', Validators.required],
      friday: [true, Validators.required],
      checkinTimefriday: ['', Validators.required],
      departureTimefriday: ['', Validators.required],
      saturday: [true, Validators.required],
      checkinTimesaturday: ['', Validators.required],
      departureTimesaturday: ['', Validators.required],
      sunday: [true, Validators.required],
      checkinTimesunday: ['', Validators.required],
      departureTimesunday: ['', Validators.required],
    });
  }

  setDefaultHours(timetable: TimeTable) {
    this.schedule = TimeTableTransformer.toRangeTable(timetable);
    for (const day in this.schedule) {
      const checkinHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].start.hour}:${this.schedule[day].start.minute}`);
      const departureHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].end.hour}:${this.schedule[day].end.minute}`);
      if (this.schedule[day].rest) {
        const checkinRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.start.hour}:${this.schedule[day].rest.start.minute}`);
        const departureRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.end.hour}:${this.schedule[day].rest.end.minute}`);
        this.timeTableForm.get(`checkinTime${day}`).setValue(`${checkinHour}-${checkinRestHour} | ${departureRestHour}-${departureHour}`);
        this.timeTableForm.get(`departureTime${day}`).setValue('');
      } else {
        this.timeTableForm.get(`checkinTime${day}`).setValue(`${checkinHour}-`);
        this.timeTableForm.get(`departureTime${day}`).setValue(departureHour);
      }
      this.timeTableForm.get(day).setValue(!checkinHour.includes('null') ? true : false);
    }
    this.schedule.uuid = timetable.uuid;
  }

  setNewHourDay(value: UpdateTimeTableDayDto) {
    const newHourDay = JSON.parse(value.timetable);
    this.schedule[value.day] = newHourDay;
    const checkinHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[value.day].start.hour}:${this.schedule[value.day].start.minute}`);
    const departureHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[value.day].end.hour}:${this.schedule[value.day].end.minute}`);
    if (this.schedule[value.day].rest) {
      const checkinRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[value.day].rest.start.hour}:${this.schedule[value.day].rest.start.minute}`);
      const departureRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[value.day].rest.end.hour}:${this.schedule[value.day].rest.end.minute}`);
      this.timeTableForm.get(`checkinTime${value.day}`).setValue(`${checkinHour}-${checkinRestHour} | ${departureRestHour}-${departureHour}`);
      this.timeTableForm.get(`departureTime${value.day}`).setValue('');
    } else {
      this.timeTableForm.get(`checkinTime${value.day}`).setValue(`${checkinHour}-`);
      this.timeTableForm.get(`departureTime${value.day}`).setValue(departureHour);
    }
    this.timeTableForm.get(value.day).setValue(!checkinHour.includes('null') ? true : false);
  }

  getTimeTableByEmployee() {
    this.subscription.add(this.timeTableService.findTimetableByEmployee(this.employee.uuid).subscribe((response) => {
      this.setDefaultHours(response.timetable);
    }));
  }

  getTimeTableFromCommerce() {
    this.subscription.add(this.timeTableService.findTimetableByCommerce(this.commerceLogged).subscribe((response: Commerce) => {
      this.setDefaultHours(response.timetable);
      this.timeTableFromCommerce = TimeTableTransformer.toRangeTable(response.timetable);
    }));
  }
  getTimeTableFromCommerceWithoutSeHours() {
    this.subscription.add(this.timeTableService.findTimetableByCommerce(this.commerceLogged).subscribe((response: Commerce) => {
      this.timeTableFromCommerce = TimeTableTransformer.toRangeTable(response.timetable);
    }));
  }

  saveEmployee() {
    const employee = this.transformEmployeeModel();
    if (this.employee) {
      employee.uuid = this.employee.uuid;
      employee.createdAtCustom = this.employee.createdAtCustom;
    }
    if (!this.isEdit) {
      this.subscription.add(this.employeeService.createEmployee(employee).subscribe((employeeItem: Employee) => {
        if (employeeItem) {
          const timeTable = this.transformTimeTableModel(employeeItem);
          if (employeeItem?.uuid === this.employee?.uuid) {
            timeTable.uuid = this.employee.timetable.uuid;
          }
          if (this.imageChanged) {
            forkJoin([this.uploadService.sendUploadEmployeeImage(this.imageFile, 'employee', employeeItem.uuid), this.timeTableService.createEmployeeTimeTable(timeTable)]).subscribe(res => {
              if (res) {
                this.navCtrl.navigateBack(['tabs/profile/commerce-info/admin-employee'], { replaceUrl: true });
              }
            });
          } else {
            this.subscription.add(this.timeTableService.createEmployeeTimeTable(timeTable).subscribe(response => {
              if (response) {
                this.navCtrl.navigateBack(['tabs/profile/commerce-info/admin-employee'], { replaceUrl: true });
              }
            }));
          }


        }
      }));
    } else {
      this.subscription.add(this.employeeService.updateEmployee(employee).subscribe((employeeItem: Employee) => {
        if (employeeItem) {
          const timeTable = this.transformTimeTableModel(employeeItem);
          if (employeeItem.isOwner) {
            localStorage.setItem('currentUser', JSON.stringify(employeeItem));
          }
          if (employeeItem?.uuid === this.employee?.uuid) {
            timeTable.uuid = this.employee.timetable.uuid;
          }
          this.subscription.add(this.timeTableService.updateTimeTable(timeTable).subscribe(response => {
            if (response) {
              this.navCtrl.navigateBack(['tabs/profile/commerce-info/admin-employee'], { replaceUrl: true });
            }
          }));
          if (this.imageChanged) {
            this.subscription.add(this.uploadService.sendUploadEmployeeImage(this.imageFile, 'employee', employeeItem.uuid).subscribe());
          }
        }
      }));
    }
  }

  transformEmployeeModel(): EmployeeDto {
    const employeeDto = new EmployeeDto();
    employeeDto.name = this.employeeForm.get('name').value;
    employeeDto.surname = this.employeeForm.get('surname').value;
    employeeDto.email = this.employeeForm.get('email').value;
    employeeDto.phone = this.employeeForm.get('phone').value.internationalNumber.replace(/\s/g, '');

    employeeDto.password = this.employee ? this.employee.password : '123456';
    employeeDto.commerce = this.commerceLogged;
    employeeDto.services = this.employeeForm.get('role').value === 'Recepcionista' ? [] :this.serviceSelected;
    employeeDto.position = this.employeeForm.get('position').value;
    employeeDto.isActive = this.employee && this.employee.isOwner ? this.employeeForm.get('isEmployee').value : this.employeeForm.get('isActive').value;
    employeeDto.isEmployee = this.isEmployee;
    employeeDto.description = this.employeeForm.get('description').value;
    employeeDto.image = this.employeeForm.get('image').value;
    employeeDto.role = this.employeeForm.get('role').value;
    employeeDto.permissions = this.selectedPermission;
    employeeDto.order = this.orderNumber.length === 0 ? this.employee.order : this.orderNumber.length + 1;
    employeeDto.createdAt = new Date();
    employeeDto.createdBy = '';
    employeeDto.createdAtCustom = new Date().toString();
    return employeeDto;
  }

  transformTimeTableModel(employee: Employee): TimeTableDto {
    const timeTableDto = new TimeTableDto();
    delete this.schedule.uuid;
    for (const day in this.schedule) {
      if (this.timeTableForm.get(day).value) {
        if (this.schedule[day].rest) {
          const checkinHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].start.hour}:${this.schedule[day].start.minute}`);
          const departureHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].end.hour}:${this.schedule[day].end.minute}`);
          const checkinRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.start.hour}:${this.schedule[day].rest.start.minute}`);;
          const departureRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.end.hour}:${this.schedule[day].rest.end.minute}`);;
          timeTableDto[day] = TimeTableTransformer.to(checkinHour, departureHour, checkinRestHour, departureRestHour);
        } else {
          timeTableDto[day] = TimeTableTransformer.to(this.timeTableForm.get(`checkinTime${day}`).value, this.timeTableForm.get(`departureTime${day}`).value);
        }
      } else {
        timeTableDto[day] = TimeTableTransformer.createCloseDay();
      }
    }
    timeTableDto.employee = employee;
    timeTableDto.createdAt = new Date();
    timeTableDto.updatedAt = new Date();
    timeTableDto.createdBy = '';
    return timeTableDto;
  }

  goToHourDayDetail(day: string) {
    const timetableId = this.schedule.uuid;
    const scheduleDay = {
      checkinHour: this.timeTableForm.get(`checkinTime${day}`).value,
      departureHour: this.timeTableForm.get(`departureTime${day}`).value,
      checkinRestHour: '',
      departureRestHour: ''
    };
    if (this.schedule[day].rest) {
      scheduleDay.checkinHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].start.hour}:${this.schedule[day].start.minute}`);
      scheduleDay.departureHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].end.hour}:${this.schedule[day].end.minute}`);
      scheduleDay.checkinRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.start.hour}:${this.schedule[day].rest.start.minute}`);;
      scheduleDay.departureRestHour = this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.end.hour}:${this.schedule[day].rest.end.minute}`);;
    }
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activatedRoute,
      state: { day, scheduleDay, timetableId, newEmployee: !this.employee ? true : false }
    };
    this.navCtrl.navigateForward(['select-hour'], navigationExtras);
  }

  gotoHoliday() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activatedRoute
    };
    this.navCtrl.navigateForward([`holiday-list/${this.employee.uuid}`], navigationExtras);
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
        handler: () => {

        }
      }
    ];
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccionar avatar',
      buttons
    });
    await actionSheet.present();
  }

  private async selectImageFromDevice(optionSelected: string) {

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
    const filename = this.utilsService.generateRandomFileName(`yeasy_${getTime(new Date())}.png`);
    this.imageFile = new File([imageBlob], `${filename}`, { type: imageBlob.type });

    this.openModal(imageBlob, 'logo');


  }
  async openModal(image, from) {
    const modal = await this.modalController.create({
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
      this.imageFile = new File([imageBlob], `${filename}`, { type: imageBlob.type });
      const reader = new FileReader();
      reader.readAsDataURL(this.imageFile);
      this.employeeForm.get('image').setValue(this.imageFile.name);
      reader.onload = (event) => {
        this.imageChanged = true;
        if (this.employee) {
          this.employee.image = reader.result as string;
        } else {
          this.image = reader.result as string;

        }
      };
    }
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

  dismissModal(modalId: string) {
    const modal: any = document.getElementById(modalId);
    if (modal) { modal.dismiss(); }
  }

  openAlert() {
    this.deleteAlert.presentAlertConfirm();
  }

  alertBox(confirm: boolean) {
    if (confirm) {
      this.deleteEmployee();
    }
  }

  async presentServiceModal() {
    const modal = await this.modalController.create({
      component: ServiceListComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        servicesSelected: this.serviceSelected, showPrice: false,
        serviceCollectionFiltered: this.serviceCollection, serviceCollection: this.serviceCollection,
        isConfigScreen: true
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.service.length > 0) {
      this.serviceSelected = data.service;
    }
  }

  deleteEmployee() {
    this.subscription.add(this.employeeService.deleteEmployee(this.employee.uuid).subscribe(res => {
      this.navCtrl.navigateBack(['tabs/profile/commerce-info/admin-employee'], { replaceUrl: true });
    }));
  }

  deleteService(service: Service) {
    const serviceIndex = this.serviceSelected.findIndex(item => item.uuid === service.uuid);
    this.serviceSelected.splice(serviceIndex, 1);
  }

  cancel() {
    this.navCtrl.navigateBack(['tabs/profile/commerce-info/admin-employee'], { replaceUrl: true });
  }

  changeAccordion(event, type: string) {
    if (type === 'timetable') {
      this.timetableText = event.detail.value ? 'Ocultar horario' : 'Horario';
    } else if (type === 'services') {
      this.servicesText = event.detail.value ? 'Ocultar servicios seleccionados' : 'Ver servicios seleccionados';
    }
  }

  goToSelectRole() {
    const navigationExtras: NavigationExtras = { state: { selectedRole: this.selectedRole } };
    if (this.employee) {
      navigationExtras.state.employee = this.employee;
    }
    this.navCtrl.navigateForward(['tabs/profile/commerce-info/admin-employee/employee-detail/select-role'], navigationExtras);
  }

  async copyToClipboard() {
    await Clipboard.write({
      string: this.employee.ambassadorCode
    });
    this.toastService.presentToast('¡Código copiado!', true);
  }

  private initForms() {
    this.initEmployeeForm();
    this.initTimeTableForm();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
