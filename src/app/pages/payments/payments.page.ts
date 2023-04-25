import { Product } from 'src/app/core/models/product/product.model';
import { ProductListComponent } from './../../shared/components/product-list/product-list.component';
import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonRouterOutlet,
  IonSelect,
  ModalController,
  NavController,
} from '@ionic/angular';
import { IPayment } from 'src/app/core/interfaces/payment.interface';
import { Customer } from 'src/app/core/models/customer/customer.model';
import { PaymentDto } from 'src/app/core/models/payments/payments.model';
import { Booking } from 'src/app/core/models/reservation.model';
import { Service } from 'src/app/core/models/service.model';
import { PaymentsService } from 'src/app/core/services/payments/payments.service';
import { DateService } from 'src/app/core/utils/date.service';
import { CustomerListComponent } from 'src/app/shared/components/customer-list/customer-list.component';
import { ServiceListComponent } from 'src/app/shared/components/service-list/service-list.component';
import { BookingService } from 'src/app/core/services/booking/booking.service';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  first,
  Observable,
  of,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { IBooking } from 'src/app/core/interfaces/booking.interface';
import { PaymentMethod } from 'src/app/core/models/payments-method/payment-method.model';
import { PaymentsMethodService } from 'src/app/core/services/payment-method/payments-method.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { ServicesService } from 'src/app/core/services/services/services.service';
import { getTime, getWeek } from 'date-fns';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { PaymentsMethod } from 'src/app/core/models/payments/payments-methods.model';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit, OnDestroy {
  @ViewChild(AlertComponent) deleteAlert: AlertComponent;
  @ViewChild('paymethod') paymethod: IonSelect;

  productSelected: Product[] = [];
  customerSelected: Customer;
  employeeSelected: Employee;
  serviceSelected: Service[] = [];
  serviceCollection: Service[] = [];
  paymentMethodCollection: PaymentsMethod[] = [];
  employeeCollection: Employee[] = [];
  booking: Booking;
  form: FormGroup;
  totalPrice;
  discountValue = 0;
  discountValueNeto;
  amountValue = 0;
  showModal = false;
  commerceLogged: string;
  isFromBooking = false;
  isInvalid = false;
  isWalkinClient = false;
  walkinClient: Customer;
  paymentToEdit: PaymentDto;
  hideWalkinClient = false;
  isSubmitted = false;
  discountSubject: Subject<string> = new Subject<string>();
  totalSubject: Subject<string> = new Subject<string>();
  subscription: Subscription = new Subscription();
  isFromNonPayment = false;
  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private dateService: DateService,
    private paymentService: PaymentsService,
    private bookingService: BookingService,
    private methodService: PaymentsMethodService,
    private router: Router,
    private employeeService: EmployeeService,
    private navCtrl: NavController,
    private serviceService: ServicesService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) { 
    this.commerceLogged = JSON.parse(
      localStorage.getItem('currentUser')
    ).commerce;
    if (this.router.getCurrentNavigation().extras.state?.isFromNonPayment) {
      this.isFromNonPayment = true;
    }
    this.initForm();
    this.discountSubject
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((event) => {
        console.log(event);
        if(event === ''){
          event = '0';
        }
        let value = Number(event) ;
        if (value > 100) {
          value = 100;
        } else if (value < 0) {
          value = 0;
        }

        this.discountValue = value;

        this.calcTotalPrice();
      });
      this.totalSubject
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((event:any) => {
        let price: string = event.detail.target.value;
        if (price) {
          if (price.includes('.')) {
            const index = price.indexOf('.');
            price = price.substring(0, index + 3);
          }
          this.priceTotal.setValue(Number.parseFloat(price));
        }
        if (
          event.detail.inputType === 'deleteContentBackward' &&
          !event.target.value &&
          this.priceTotal.value.toString().length === 1
        ) {
          this.priceTotal.setValue(0);
        }
        this.calcTotalPrice();
      });
  }

  get customer() {
    return this.form.get('customer');
  }
  get amount() {
    return this.form.get('amount');
  }
  get employee() {
    return this.form.get('employee');
  }
  get payMethod() {
    return this.form.get('payMethod');
  }

  get priceTotal() {
    return this.form.get('priceTotal');
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ionViewWillEnter() {
    this.resetFields();
    this.getAllMethods();
    this.getWalkinCustomer();
    this.findEmployeeCollection(this.commerceLogged);
    this.getAllService();
    if (this.route.snapshot.queryParams.hideWalkinClient) {
      this.hideWalkinClient = true;
    }
    if (this.route.snapshot.queryParams.payment) {
      this.isFromBooking = true;
      this.initForm();
      const payment: PaymentDto = JSON.parse(
        this.route.snapshot.queryParams.payment
      );
      if (payment.customer.isWalkingClient) {
        this.isWalkinClient = true;
      } else {
        this.customer.setValue(
          `${payment?.customer.name} ${payment?.customer.lastname}`
        );
        this.customerSelected = payment.customer;
      }
      let serviceCollectionMapped: Service[] = [];
      payment.service.forEach((service) => {
        if (payment.paymentServices && payment.paymentServices.length > 0) {
          const paymentService = payment.paymentServices.find(
            (item) => item.serviceUuid === service.uuid
          );
          if (paymentService) {
            for (let i = 0; i < paymentService.quantity; i++) {
              serviceCollectionMapped.push(service);
            }
          }
        } else {
          serviceCollectionMapped = [...payment.service];
        }
      });
      this.serviceSelected = [...serviceCollectionMapped];
      if (payment.product) {
        this.productSelected = payment.product.map((product) => {
          const paymentProduct = payment.paymentProducts.find(
            (item) => item.productUuid === product.uuid
          );
          if (paymentProduct) {
            product.qty = paymentProduct.quantity;
          }
          return product;
        });
      }
      if (payment.uuid) {
        this.paymentToEdit = payment;
      }
      if (payment.method) {
        this.selectedMethod(payment.method.uuid);
      }
      this.booking = payment.booking;
      this.customerSelected = payment.customer;
      this.commerceLogged = payment.commerce;
      
      this.totalPrice = payment.amount + payment.decimals / 100;
    } else {
      const empLogged = JSON.parse(localStorage.getItem('currentUser'));
      this.selectedEmployee(empLogged.uuid);
    }
    if (this.route.snapshot.queryParams.newCustomer) {
      this.customerSelected = JSON.parse(
        this.route.snapshot.queryParams.newCustomer
      );
      this.customer.setValue(
        `${this.customerSelected?.name} ${this.customerSelected.lastname}`
      );
    }
  }

  ngOnInit() {
    this.resetFields();
  }

  getWalkinCustomer() {
    this.subscription.add(
      this.customerService
        .getWalkinCustomer()
        .subscribe((res) => (this.walkinClient = res))
    );
  }

  getAllService() {
    this.subscription.add(
      this.serviceService
        .findServiceByCommerce(this.commerceLogged)
        .subscribe((res: Service[]) => {
          this.serviceCollection = res;
        })
    );
  }

  getAllMethods() {
    this.subscription.add(
      this.methodService
        .findPaymentMethodByCommerce(this.commerceLogged)
        .subscribe((response: PaymentMethod[]) => {
          this.paymentMethodCollection = response;
        })
    );
  }

  selectedEmployee(employeeId: string) {
    this.employee.setValue(employeeId);
    this.employeeSelected = this.employeeCollection.find(
      (employee) => employee.uuid === employeeId
    );
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CustomerListComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        isNewPayment: true,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.customer !== undefined) {
      this.customerSelected = data.customer;
      this.customer.setValue(
        `${this.customerSelected.name} ${this.customerSelected.lastname}`
      );
    }
  }
  async presentServiceModal() {
    const modal = await this.modalController.create({
      component: ServiceListComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        servicesSelected: this.serviceSelected,
        showPrice: true,
        serviceCollectionFiltered: this.serviceCollection,
        serviceCollection: this.serviceCollection,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.service.length > 0) {
      this.serviceSelected = data.service;
      this.calcTotalPrice();
    }
  }

  async presentProductModal() {
    const modal = await this.modalController.create({
      component: ProductListComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { productSelected: this.productSelected },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (!data) {
      this.productSelected = [];
    }
    this.productSelected = this.productSelected.filter(
      (item) => item !== undefined
    );
    this.productSelected = this.productSelected
      .reverse()
      .filter(
        (product, index, self) =>
          self.findIndex((item) => item.uuid === product.uuid) === index
      );
    this.calcTotalPrice();
  }

  calcTotalPriceService(service: Service[]): number {
    let price = 0;
    service.forEach((item: Service) => {
      price = price + item.price;
    });
    return price;
  }

  calcTotalPriceProduct(product: Product[]): number {
    let price = 0;
    product.forEach((item: Product) => {
      price = price + item.price * item.qty;
    });
    return price;
  }

  selectedMethod(value: string) {
    this.payMethod.setValue(value);
  }

  onSubmit() {
    if (this.payMethod.value === '') {
      this.paymethod.open();
      this.payMethod.valueChanges.pipe(first()).subscribe((res: any) => {
        this.isSubmitted = true;
        if (this.form.valid) {
          const newPayment: PaymentDto = new PaymentDto();
          if (this.totalPrice.toString().includes('.')) {
            newPayment.amount = parseInt(
              this.totalPrice.toString().split('.')[0],
              10
            );
            newPayment.decimals = parseInt(
              this.totalPrice.toFixed(2).split('.')[1],
              10
            );
            if (this.totalPrice.toString().split('.')[1].length === 1) {
              newPayment.decimals =
                parseInt(this.totalPrice.toString().split('.')[1], 10) * 10;
            }
          } else if (this.totalPrice.toString().includes(',')) {
            newPayment.amount = parseInt(
              this.totalPrice.toString().split(',')[0],
              10
            );
            newPayment.decimals = parseInt(
              this.totalPrice.toFixed(2).split(',')[1],
              10
            );
            if (this.totalPrice.toString().split(',')[1].length === 1) {
              newPayment.decimals =
                parseInt(this.totalPrice.toString().split(',')[1], 10) * 10;
            }
          } else {
            newPayment.amount = this.totalPrice;
            newPayment.decimals = 0;
          }
          newPayment.product = this.productSelected;
          newPayment.service = this.serviceSelected;
          newPayment.date = this.dateService.formatDate(new Date());
          newPayment.week = getWeek(new Date(), {
            weekStartsOn: 1,
            firstWeekContainsDate: 4,
          });
          newPayment.discount = this.discountValue;
          newPayment.commerce = this.commerceLogged;
          newPayment.employee = this.employeeSelected
            ? this.employeeSelected
            : this.employeeCollection.find(
                (employee) => employee.uuid === this.employee.value
              );
          newPayment.method = this.paymentMethodCollection.find(
            (method) => method.uuid === this.payMethod.value
          );
          newPayment.customer =
            this.customerSelected === null
              ? this.walkinClient
              : this.customerSelected;
          delete newPayment.customer.booking;
          if (this.booking) {
            newPayment.booking = this.booking;
            this.booking.status = 'Realizada';
            newPayment.employee = this.employeeSelected
              ? this.employeeSelected
              : this.employeeCollection.find(
                  (employee) => employee.uuid === this.booking.asignedTo.uuid
                );
            newPayment.bookingSettedUuid = this.booking.uuid;
            this.concatSubmitRequest(newPayment, this.booking);
          } else {
            newPayment.booking = null;
            newPayment.bookingSettedUuid = 'noBooking_' + getTime(new Date());
            newPayment.employee = this.employeeSelected
              ? this.employeeSelected
              : this.employeeCollection.find(
                  (employee) => employee.uuid === this.employee.value
                );
            this.subscription.add(
              this.savePayment(newPayment).subscribe((response) => {
                if (response) {
                  this.confirmPayment(response);
                }
              })
            );
          }
        } else {
          this.isInvalid = true;
        }
      });
    } else {
      this.isSubmitted = true;
      const newPayment: PaymentDto = new PaymentDto();
      if (this.totalPrice.toString().includes('.')) {
        newPayment.amount = parseInt(
          this.totalPrice.toString().split('.')[0],
          10
        );
        newPayment.decimals = parseInt(
          this.totalPrice.toFixed(2).split('.')[1],
          10
        );

        if (this.totalPrice.toString().split('.')[1].length === 1) {
          newPayment.decimals =
            parseInt(this.totalPrice.toString().split('.')[1], 10) * 10;
        }
      } else if (this.totalPrice.toString().includes(',')) {
        newPayment.amount = parseInt(
          this.totalPrice.toString().split(',')[0],
          10
        );
        newPayment.decimals = parseInt(
          this.totalPrice.toFixed(2).split(',')[1],
          10
        );

        if (this.totalPrice.toString().split(',')[1].length === 1) {
          newPayment.decimals =
            parseInt(this.totalPrice.toString().split(',')[1], 10) * 10;
        }
      } else {
        newPayment.amount = this.totalPrice;
        newPayment.decimals = 0;
      }
      if (this.paymentToEdit) {
        newPayment.uuid = this.paymentToEdit.uuid;
      }
      newPayment.product = this.productSelected;
      newPayment.service = this.serviceSelected;
      newPayment.date = this.paymentToEdit
        ? this.paymentToEdit.date
        : this.dateService.formatDate(new Date());
      newPayment.week = this.paymentToEdit
        ? this.paymentToEdit.week
        : getWeek(new Date(), { weekStartsOn: 1, firstWeekContainsDate: 4 });
      newPayment.discount = this.discountValue;
      newPayment.employee = this.employeeSelected
        ? this.employeeSelected
        : this.employeeCollection.find(
            (employee) => employee.uuid === this.employee.value
          );
      newPayment.commerce = this.commerceLogged;
      newPayment.method = this.paymentMethodCollection.find(
        (method) => method.uuid === this.payMethod.value
      );
      newPayment.customer =
        this.customerSelected === null
          ? this.walkinClient
          : this.customerSelected;
      delete newPayment.customer.booking;
      if (this.booking) {
        newPayment.booking = this.booking;
        newPayment.bookingSettedUuid = this.booking.uuid;
        this.booking.status = 'Realizada';
        this.concatSubmitRequest(newPayment, this.booking);
      } else {
        newPayment.booking = null;
        newPayment.bookingSettedUuid = 'noBooking_' + getTime(new Date());
        newPayment.employee = this.employeeSelected
          ? this.employeeSelected
          : this.employeeCollection.find(
              (employee) => employee.uuid === this.employee.value
            );
        this.subscription.add(
          this.savePayment(newPayment).subscribe((response) => {
            if (response) {
              this.confirmPayment(response);
            }
          })
        );
      }
    }
  }

  findEmployeeCollection(commerce: string) {
    this.subscription.add(
      this.employeeService
      .findEmployeesWithinactivesPayments(commerce)
        .subscribe((employees) => {
          this.employeeCollection = [
            ...employees.filter(
              (employee) => employee.isEmployee || employee.isOwner
            ),
          ];
        })
    );
  }

  savePayment(payment: PaymentDto): Observable<IPayment> {
    return this.paymentService.savePaymentByCommerce(payment);
  }

  updateBooking(booking: Booking): Observable<IBooking> {
    return this.bookingService.updateBookingPayment(booking);
  }

  concatSubmitRequest(payment: PaymentDto, book: Booking) {
    this.savePayment(payment)
      .pipe(
        first(),
        switchMap((payload: IPayment) => {
          book.paymentSettedUuid = payload.uuid;
          const pay = new PaymentDto();
          pay.amount = payload.amount;
          pay.booking = payload.booking;
          pay.bookingSettedUuid = payload.bookingSettedUuid;
          pay.commerce = payload.commerce;
          pay.customer = payload.customer;
          pay.date = payload.date;
          pay.decimals = payload.decimals;
          pay.discount = payload.discount;
          pay.employee = payload.employee;
          pay.isDeleted = payload.isDeleted;
          pay.product = payload.product;
          pay.uuid = payload.uuid;
          pay.week = payload.week;
          book.payment = pay;
          return combineLatest([of(payload), this.updateBooking(book)]);
        })
      )
      .subscribe((res: [IPayment, IBooking]) => this.confirmPayment(res[0]));
  }

  confirmPayment(payment: IPayment) {
    this.route.snapshot.queryParams = {};

    this.navCtrl.navigateForward(['payment-confirmation'], {
      state: { payment, isFromNonPayment: this.isFromNonPayment },
    });
    this.resetFields();
  }

  changeAmount(event) {
    let price = event.target.value;
    if (price) {
      if (price.includes('.')) {
        const index = price.indexOf('.');
        price = price.substring(0, index + 3);
      } else if (price.includes(',')) {
        const index = price.indexOf(',');
        price = price.substring(0, index + 3);
      }
      this.amountValue = Number.parseFloat(price);
      this.calcTotalPrice();
    } else {
      this.amountValue = 0;
      this.calcTotalPrice();
    }
  }

  calcTotalPrice() {
    this.totalPrice =
      
      this.calcTotalPriceProduct(this.productSelected) +
      this.calcTotalPriceService(this.serviceSelected) +
      (this.amountValue - this.discountValueNeto);
    if (this.discountValue > 0) {
      const fixedTotalPrice = (
        this.totalPrice -
        this.totalPrice * (this.discountValue / 100)
      ).toFixed(2);
      this.totalPrice = parseFloat(fixedTotalPrice);
    }
    if (this.totalPrice < 0) {
      this.totalPrice = 0;
    }
    
  }

  inputDiscountPercent(event) {
    this.discountSubject.next(event.target.value);
  }
  inputDiscount(event) {
   
    
    if (event.target.value < 0) {
      event.target.value = 0;
    }
    this.discountValueNeto = event.target.value;
    this.calcTotalPrice();
  }

  deleteProduct(product: Product) {
    const productIndex = this.productSelected.findIndex(
      (item) => item.uuid === product.uuid
    );
    this.productSelected.splice(productIndex, 1);
    this.calcTotalPrice();
  }

  checkIfZero() {
    if (this.discountValueNeto === 0) {
      this.discountValueNeto = '';
    }
  }
  checkIfZeroBlur() {
    if (this.discountValueNeto === '') {
      this.discountValueNeto = 0;
    }
  }

  deleteService(service: Service) {
    const serviceIndex = this.serviceSelected.findIndex(
      (item) => item.uuid === service.uuid
    );
    this.serviceSelected.splice(serviceIndex, 1);
    this.calcTotalPrice();
  }

  openAlert() {
    this.deleteAlert.presentAlertConfirm();
  }

  alertBox(value: boolean) {
    if (value) {
      this.resetFields();
      this.navCtrl.navigateForward(['tabs/payments'], { replaceUrl: true });
    }
  }
  onChangeCheckbox(event) {
    this.isWalkinClient = event.detail.checked;
    if (this.isWalkinClient) {
      this.customer.setValue('Cliente sin cita previa');
    } else {
      this.customer.setValue(null);
    }
  }
  ionViewDidLeave() {
    this.resetFields();
    console.log('didleave', this.discountValue);
  }

  formatPrice(event) {
    this.totalSubject.next(event);
    
  }

  ngOnDestroy(): void {
    this.resetFields();
    this.subscription.unsubscribe();
  }

  private initForm() {
    this.form = this.fb.group({
      customer: [''],
      employee: [''],
      amount: [],
      payMethod: [''],
      priceTotal: []
    });

    if (!this.isFromBooking) {
      this.amount.setValidators(Validators.min(0));
      this.employee.setValidators(Validators.required);
      this.customer.setValidators(Validators.required);
    }
  }
  private resetFields() {
    this.initForm();
    this.customerSelected = null;
    this.serviceSelected = [];
    this.productSelected = [];
    this.totalPrice = 0;
    this.amountValue = 0;
    this.discountValue = 0;
    this.discountValueNeto = 0;
    this.isWalkinClient = false;
    this.isInvalid = false;
    this.paymentToEdit = null;
  }
}

