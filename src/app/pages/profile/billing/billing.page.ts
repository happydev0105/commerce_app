import { Subscription } from 'rxjs';
import { PaymentDto } from './../../../core/models/payments/payments.model';
import { IonModal, ModalController, NavController } from '@ionic/angular';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { ActivatedRoute } from '@angular/router';
import { BillingService } from './../../../core/services/billing/billing.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { format, getWeek } from 'date-fns';
import { RangeSelectorComponent } from 'src/app/shared/components/range-selector/range-selector.component';
import { ExportService } from 'src/app/core/services/export/export.service';
import { Service } from 'src/app/core/models/service.model';
import { PaymentService } from 'src/app/core/models/payments-service/payments-service.model';
import { PaymentProduct } from 'src/app/core/models/payments-product/payments-product.model';

type Excel = {

  fecha: string;
  total: number;
  tipo: string;
  descuento: number;
  servicio: string;
  producto: string;
  empleado: string;
  pago: string;


};

@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
})
export class BillingPage implements OnInit, OnDestroy {

  @ViewChild(IonModal) selectDateModal: IonModal;

  currentYear = new Date().getFullYear();
  weekNumber = 0;
  billingCollection: any = [];
  totalAmounts = [];
  today = '';
  showDatepicker = false;
  selectedDate = '';
  searchByDay = false;
  commerceLogged: string;
  subscription: Subscription = new Subscription();

  constructor(
    private billingService: BillingService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private utilsService: UtilsService,
    private exportService: ExportService,
    private activatedRoute: ActivatedRoute) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
    this.weekNumber = getWeek(new Date(), { weekStartsOn: 1, firstWeekContainsDate: 4 });
    this.today = this.utilsService.calculateToday();
  }


  ionViewWillEnter() {
    this.totalAmounts = [];
    this.getCommerceBillingByWeek();
    this.searchByDay = false;
  }

  seeActualWeek() {
    this.totalAmounts = [];
    this.getCommerceBillingByWeek();
    this.searchByDay = false;
  }


  ngOnInit() {

  }

  getCommerceBillingByWeek() {
    this.subscription.add(this.billingService.getCommerceBillingFromPaymentByWeek(this.commerceLogged, this.weekNumber, this.currentYear)
      .subscribe(response => {
        this.billingCollection = Object.entries(response);

        this.billingCollection.map(item => {
          this.totalAmounts.push(item[1][item[1].length - 1].totalAmount.toFixed(2));
          item[1] = item[1].filter(i => i.uuid);
        });
        console.log(this.billingCollection);

      }));
  }

  isToday(item: string): boolean {
    return item === this.today;
  }

  dismissModal(modalId: string) {
    const modal: any = document.getElementById(modalId);
    if (modal) { modal.dismiss(); }
  }

  onDismiss(event, searchDay: boolean) {
    if (searchDay) {
      this.subscription.add(this.billingService.getCommerceBillingFromPaymentByDay(this.commerceLogged, this.selectedDate)
        .subscribe(response => {
          if (response) {
            this.totalAmounts = [];
            const newDate = [];
            newDate.push(this.selectedDate);
            newDate.push(response[0]);
            this.billingCollection = [];
            this.billingCollection.push(newDate);
            this.totalAmounts.push(response[1].toFixed(2));
            this.searchByDay = true;
          }
        }));
    }
    this.selectDateModal.dismiss(null, 'cancel');
  }

  async selectRange() {
    const modal = await this.modalCtrl.create({
      component: RangeSelectorComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log(data);

    this.billingService.getCommerceBillingBetweenDates(this.commerceLogged, data).subscribe((results: PaymentDto[]) => {
      if (results.length > 0) {
      this.exportService.createNewExcel(this.mapExcelDocument(results));
      }
    });


  }

  mapExcelDocument(payments: PaymentDto[]): Excel[] {
    const excelCollection: Excel[] = [];
    payments.forEach((payment: PaymentDto) => {
      const excel: Excel = {
        fecha: format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm'),
        total: (payment?.amount + (payment?.decimals / 100)),
        descuento: payment.discount,
        tipo: payment.booking ? 'Reserva' : 'Venta directa',
        servicio: payment.paymentServices ? payment.paymentServices.map((service: PaymentService) => service.serviceName).join(',') : '',
        producto: payment.paymentProducts ? payment.paymentProducts.map((service: PaymentProduct) => service.productName).join(',') : '',
        pago: payment.method.label,
        empleado: payment.employee ?
          `${payment?.employee?.name} ${payment?.employee?.surname}` :
          `${payment?.booking?.asignedTo?.name} ${payment?.booking?.asignedTo?.surname}`
      };
      excelCollection.push(excel);
    });
    return excelCollection.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  dateChanged(dateSelected: string) {
    const date = new Date(dateSelected);
    const day = date.getDate();
    const dayFormatted = day.toString().length === 1 ? `0${day}` : day;
    const month = date.getMonth() + 1;
    const monthFormatted = month.toString().length === 1 ? `0${month}` : month;
    const year = date.getFullYear();
    const dateFormatted = `${year}-${monthFormatted}-${dayFormatted}`;
    this.selectedDate = dateFormatted;
  }

  goToDetail(payment: PaymentDto) {
    if (payment.booking) {
      this.navCtrl.navigateForward([`booking/${payment.booking.uuid}`], { relativeTo: this.activatedRoute, state: { fromBilling: true } });
    } else {
      this.navCtrl.navigateForward([`payment-detail/${payment.uuid}`], { relativeTo: this.activatedRoute });
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
