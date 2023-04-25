/* eslint-disable id-blacklist */
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, ModalController, IonRouterOutlet, NavController } from '@ionic/angular';
import { getTime } from 'date-fns';
import { IonIntlTelInputModel, IonIntlTelInputValidators } from 'ion-intl-tel-input';
import { Subscription } from 'rxjs';
import { ScheduleDay } from 'src/app/core/interfaces/schedule-day.interface';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { EmployeeDto } from 'src/app/core/models/employee/employee.dto.model';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { RoleValues } from 'src/app/core/models/enums/role.enum';
import { Permission } from 'src/app/core/models/permission/permission.model';
import { Service } from 'src/app/core/models/service.model';
import { TimeTable } from './../../../core/models/timeTable/timeTable.model';
import { TimeTableDto } from 'src/app/core/models/timeTable/timeTable.dto.model';
import { UpdateTimeTableDayDto } from 'src/app/core/models/timeTable/update-timeTable-day.dto';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
import { ServicesService } from 'src/app/core/services/services/services.service';
import { TimeTableService } from 'src/app/core/services/timeTable/time-table.service';
import { UploadService } from 'src/app/core/services/upload/upload.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { TimeTableTransformer } from 'src/app/core/transformers/timeTable.transformer';
import { DateService } from 'src/app/core/utils/date.service';
import { CropImgComponent } from 'src/app/shared/components/crop-img/crop-img.component';
import { ServiceListComponent } from 'src/app/shared/components/service-list/service-list.component';
import { OpeningHours } from '../admin-employee/employee-detail/employee-detail.page';
import { Clipboard } from '@capacitor/clipboard';
import { ToastService } from 'src/app/core/services/toast/toast.service';
@Component({
  selector: 'app-edit-my-profile',
  templateUrl: './edit-my-profile.page.html',
  styleUrls: ['./edit-my-profile.page.scss'],
})
export class EditMyProfilePage implements OnInit {

  @ViewChild('employeeLogo', { static: false }) employeeLogo: ElementRef<HTMLElement>;
  employee: Employee;
  timeTableFromEmployee: TimeTable;
  timeTableFromCommerce: ScheduleDay;
  employeeForm: FormGroup;
  timeTableForm: FormGroup;
  defaultImage = '/assets/no-image.jpeg';
  openingHours: OpeningHours;
  closingHours: OpeningHours;
  commerceLogged: string;
  serviceSelected: Service[] = [];
  schedule: ScheduleDay;
  timetableText = 'Ver horario';
  servicesText = 'Ocultar servicios seleccionados';
  serviceCollection: Service[] = [];
  weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  selectedRole = { name: 'Empleado', value: 'empleado' };
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

  role = 'empleado_basico';

  constructor(
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
    private utilsService: UtilsService,
    private toastService: ToastService,
  ) {
    const currentUser: Employee = JSON.parse(localStorage.getItem('currentUser'));
    this.commerceLogged = currentUser.commerce;
    this.initForms();
    this.subscription.add(this.employeeService.findEmployeeById(currentUser.uuid).subscribe(employee => {
      this.employee = employee;
      this.role = employee.role;
      this.serviceSelected = this.employee.services ? this.employee.services : [];
      this.getTimeTableByEmployee();
      this.initEmployeeForm();
      this.getRole();
    }));
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
      position: [this.employee ? this.employee.position : ''],
      description: [this.employee ? this.employee.description : ''],
      image: [this.employee ? this.employee.image : this.defaultImage],
      role: [this.employee ? this.employee.role : this.selectedRole.value, Validators.required],
      isEmployee: [this.employee ? this.employee.isEmployee : true]
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
    this.subscription.add(this.employeeService.updateEmployee(employee).subscribe((employeeItem: Employee) => {
      console.log(employeeItem);

      if (employeeItem) {
        const timeTable = this.transformTimeTableModel(employeeItem);
        if (employeeItem?.uuid === this.employee?.uuid) {
          timeTable.uuid = this.employee.timetable.uuid;
        }
        if (employeeItem.isOwner) {
          localStorage.removeItem('currentUser');
          localStorage.setItem('currentUser', JSON.stringify(employeeItem));
        }
        this.subscription.add(this.timeTableService.updateTimeTable(timeTable).subscribe(response => {
          if (response) {
            this.navCtrl.navigateBack(['tabs/profile'], { replaceUrl: true });
          }
        }));
        if (this.imageChanged) {
          this.subscription.add(this.uploadService.sendUploadEmployeeImage(this.imageFile, 'employee', employeeItem.uuid).subscribe());
        }
      }
    }));
  }

  transformEmployeeModel(): EmployeeDto {
    console.log('asd', this.employeeForm.get('isEmployee').value);

    const employeeDto = new EmployeeDto();
    employeeDto.name = this.employeeForm.get('name').value;
    employeeDto.surname = this.employeeForm.get('surname').value;
    employeeDto.email = this.employeeForm.get('email').value;
    employeeDto.phone = this.employeeForm.get('phone').value.internationalNumber.replace(/\s/g, '');

    employeeDto.password = this.employee ? this.employee.password : '123456';
    employeeDto.commerce = this.commerceLogged;
    employeeDto.services = this.serviceSelected;
    employeeDto.position = this.employeeForm.get('position').value;
    employeeDto.isActive = this.employee && this.employee.isOwner ?
      this.employeeForm.get('isEmployee').value : this.employeeForm.get('isActive').value;;
    employeeDto.isEmployee = this.employeeForm.get('isEmployee').value;
    employeeDto.description = this.employeeForm.get('description').value;
    employeeDto.image = this.employeeForm.get('image').value;
    employeeDto.role = this.employee.role;
    employeeDto.permissions = this.selectedPermission;
    employeeDto.order = this.employee.order;
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
          const checkinHour =
            this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].start.hour}:${this.schedule[day].start.minute}`);
          const departureHour =
            this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].end.hour}:${this.schedule[day].end.minute}`);
          const checkinRestHour =
            this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.start.hour}:${this.schedule[day].rest.start.minute}`);;
          const departureRestHour =
            this.dateService.addZeroToMinutesAndHours(`${this.schedule[day].rest.end.hour}:${this.schedule[day].rest.end.minute}`);;
          timeTableDto[day] = TimeTableTransformer.to(checkinHour, departureHour, checkinRestHour, departureRestHour);
        } else {
          timeTableDto[day] =
            TimeTableTransformer.to(this.timeTableForm.get(`checkinTime${day}`).value, this.timeTableForm.get(`departureTime${day}`).value);
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

  async getImage() {
    let optionSelected = '';
    const buttons = [
      {
        text: 'Hacer foto',
        icon: 'camera',
        handler: async () => {
          optionSelected = 'camera';
          await this.selectImageFromDevice(optionSelected);
        }
      },
      {
        text: 'Seleccionar de la galería',
        icon: 'image',
        handler: async () => {
          optionSelected = 'gallery';
          await this.selectImageFromDevice(optionSelected);
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'destructive',
        handler: () => { }
      }
    ];
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccionar avatar',
      buttons
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
      promptLabelCancel: 'Cancelar'
    });
    const imageBlob = this.utilsService.convertBase64ToBlob(image.dataUrl);
    const filename = this.utilsService.generateRandomFileName(`yeasy_${getTime(new Date())}.png`);
    this.imageFile = new File([imageBlob], `${filename}`, { type: imageBlob.type });

    this.openModal(imageBlob, 'logo');


  }
  async openModal(image: Blob, from: string) {
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

  deleteService(service: Service) {
    const serviceIndex = this.serviceSelected.findIndex(item => item.uuid === service.uuid);
    this.serviceSelected.splice(serviceIndex, 1);
  }

  cancel() {
    this.navCtrl.navigateBack(['tabs/profile'], { replaceUrl: true });
  }

  changeAccordion(event, type: string) {
    if (type === 'timetable') {
      this.timetableText = event.detail.value ? 'Ocultar horario' : 'Ver horario';
    } else if (type === 'services') {
      this.servicesText = event.detail.value ? 'Ocultar servicios seleccionados' : 'Ver servicios seleccionados';
    }
  }

  goToSelectRole() {
    this.navCtrl.navigateForward(['select-role'], { relativeTo: this.activatedRoute, state: { selectedRole: this.selectedRole, isWizard: false, isProfile: true } });
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
