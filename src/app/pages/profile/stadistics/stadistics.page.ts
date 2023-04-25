/* eslint-disable max-len */
import { PaymentByType } from './../../../core/interfaces/paymentByType.interface';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { StadisticsService } from './../../../core/services/stadistics/stadistics.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BookingReport } from 'src/app/core/interfaces/booking-report.interface';
import { Top5CustomersReport } from 'src/app/core/interfaces/top-five-customer-report.interface';
import {
  PickerColumn,
  ActionSheetController,
  NavController,
  PickerColumnOption,
  PickerController,
} from '@ionic/angular';
import { TeamPerformance } from 'src/app/core/interfaces/team-performance.interface';
import { format, getWeek, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Top5ProductsReport } from 'src/app/core/interfaces/top-five-product-report.interface';
import { Top5ServicesReport } from 'src/app/core/interfaces/top-five-services-report.interface';
import { Selector } from 'src/app/core/models/selector.model';

@Component({
  selector: 'app-stadistics',
  templateUrl: './stadistics.page.html',
  styleUrls: ['./stadistics.page.scss'],
})
export class StadisticsPage implements OnDestroy {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };
  lineChartOptions: ChartOptions<'line'> = { responsive: true };
  lineChartLegend = true;
  lineChartPlugins = [];

  pieChartOptions: ChartOptions<'pie'> = { responsive: true };
  pieChartLabels = [
    'Finalizadas',
    'Pendientes',
    'Pendientes de pago',
    'No asistidas',
  ];
  pieChartDatasets = [{ data: [] }];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];

  bookingReport: BookingReport = {
    finished: 0,
    non_attendant: 0,
    payment_pending: [],
    pending: 0,
    total: 0,
  };
  bookingReportWeek: BookingReport = {
    finished: 0,
    non_attendant: 0,
    payment_pending: [],
    pending: 0,
    total: 0,
  };

  today = '';
  week = 0;
  month = '';
  monthName = '';
  year = '';

  yearsCollection: Selector[] = [];
  weeksCollection: Selector[] = [];
  showWeekSelector = false;
  showDaySelector = false;
  topFiveCustomersReport: Top5CustomersReport[] = [];
  topFiveProductsReport: Top5ProductsReport[] = [];
  topFiveServicesReport: Top5ServicesReport[] = [];
  totalBilling = 0;
  totalProductDisaggregated = 0;
  totalServiceDisaggregated = 0;
  totalOthersDisaggregated = 0;
  newCustomerReport = {
    new: 0,
    comingBack: 0,
  };
  performanceTeamReport: TeamPerformance[] = [];
  totalPercentage = 0;

  columnsFiltered: PickerColumn[] = [];
  selectorTimeForm: FormGroup;
  selectedTimeRange = 'day';
  showRange = 'Hoy';

  paymentsByTypeCollection: PaymentByType[] = [];
  pickerColumns: PickerColumn[];
  pickerColumnsWeek: PickerColumn[];
  subscription: Subscription = new Subscription();

  constructor(
    private stadisticsService: StadisticsService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private actionSheetController: ActionSheetController,
    private navCtrl: NavController,
    private pickerCtrl: PickerController,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {
    this.today = format(new Date(), 'yyyy-MM-dd');
    this.week = getWeek(new Date(), {
      weekStartsOn: 1,
      firstWeekContainsDate: 4,
    });
    this.year = new Date().getFullYear().toString();
    this.monthName = format(new Date(), 'MMMM', { locale: es });

    this.initForms();
    
  }

  get daySelected() {
    return this.selectorTimeForm.get('daySelected');
  }

  get monthSelected() {
    return this.selectorTimeForm.get('monthSelected');
  }

  get yearSelected() {
    return this.selectorTimeForm.get('yearSelected');
  }
  ionViewWillEnter() {
    this.getInfoByDay();
  
      this.pickerColumns = this.generateDaySelector();
      this.pickerColumnsWeek = this.generateWeekSelector();
  }
  initForms() {
    this.selectorTimeForm = this.formBuilder.group({
      daySelected: [new Date().toISOString()],
      monthSelected: [''],
      yearSelected: [''],
    });
  }

  getInfoByDay() {
    this.getReportFromBookingByDay();
    this.getTopFiveCustomersReportByDay();
    this.getTotalBillingByDay();
    this.getNewCustomerReportByDay();
    this.getTopPerformanceTeamByDay();
    this.getPaymentsByTypeAndDay();
    this.getTopFiveProductsReportByDay();
    this.getTopFiveServicesReportByDay();
  }

  getInfoByWeek() {
    this.getReportFromBookingByWeek();
    this.getTopFiveCustomersReportByWeek();
    this.getTotalBillingByWeek();
    this.getNewCustomerReportByWeek();
    this.getTopPerformanceTeamByWeek();
    this.getPaymentsByTypeAndWeek();
    this.getTopFiveProductsReportByWeek();
    this.getTopFiveServicesReportByWeek();
  }

  getInfoByMonth() {
    this.getReportFromBookingByMonth();
    this.getTopFiveCustomersReportByMonth();
    this.getTotalBillingByMonth();
    this.getNewCustomerReportByMonth();
    this.getTopPerformanceTeamByMonth();
    this.getPaymentsByTypeAndMonth();
    this.getTopFiveProductsReportByMonth();
    this.getTopFiveServicesReportByMonth();
  }

  getInfoByYear() {
    this.getReportFromBookingByYear();
    this.getTopFiveCustomersReportByYear();
    this.getTotalBillingByYear();
    this.getNewCustomerReportByYear();
    this.getTopPerformanceTeamByYear();
    this.getPaymentsByTypeAndYear();
    this.getTopFiveProductsReportByYear();
    this.getTopFiveServicesReportByYear();
  }

  getReportFromBookingByDay() {
    this.subscription.add(
      this.stadisticsService
        .getReportFromBookingByDay(this.currentUser.commerce, this.today)
        .subscribe((response) => {
          this.bookingReport = response;
          Array.from(Object.entries(this.bookingReport))
            .slice(0, Array.from(Object.entries(this.bookingReport)).length - 1)
            .forEach((item) => {
              this.pieChartDatasets[0].data.push(item[1]);
            });
        })
    );
  }

  getTopFiveCustomersReportByDay() {
    this.subscription.add(
      this.stadisticsService
        .getTop5CustomersByDay(this.currentUser.commerce, this.today)
        .subscribe((response) => (this.topFiveCustomersReport = response))
    );
  }

  getTotalBillingByDay() {
    const labels = [];
    const data = [];
    this.lineChartData = {
      datasets: [],
      labels: [],
    };
    this.subscription.add(
      this.stadisticsService
        .getTotalBillingByDay(this.currentUser.commerce, this.today)
        .subscribe((response) => {
          if (response) {
            response.forEach((item) => {
              labels.push(format(new Date(item[0]), 'eee', { locale: es }));
              data.push(item[1]);
            });
            this.totalBilling = response[response.length - 1][1];
            this.totalProductDisaggregated = response[response.length - 1][2];
            this.totalServiceDisaggregated = response[response.length - 1][3];
            this.totalOthersDisaggregated = response[response.length - 1][4];
          }
          const todayFormatted = format(new Date(this.today), 'dd MMMM yyyy ', {
            locale: es,
          });
          const dataset = {
            data,
            label: `Facturación del ${todayFormatted}`,
            fill: false,
            tension: 0.5,
            borderColor: 'rgba(255,122,34,49.3)',
            backgroundColor: 'rgba(255,0,0,0.3)',
          };
          this.lineChartData.datasets.push(dataset);
          this.lineChartData.labels = labels;
        })
    );
  }

  getNewCustomerReportByDay() {
    this.subscription.add(
      this.stadisticsService
        .getNewCustomersByDay(this.currentUser.commerce, this.today)
        .subscribe((response: any) => (this.newCustomerReport = response))
    );
  }

  getTopPerformanceTeamByDay() {
    this.subscription.add(
      this.stadisticsService
        .getTeamPerformanceByDay(this.currentUser.commerce, this.today)
        .subscribe((response) => {
          if (response) {
            this.performanceTeamReport = response;
            if (response.length > 0) {
              this.totalPercentage = this.performanceTeamReport[0].totalAmount;
            }
          }
        })
    );
  }

  getPaymentsByTypeAndDay() {
    this.subscription.add(
      this.stadisticsService
        .getPaymentsByTypeAndDay(this.currentUser.commerce, this.today)
        .subscribe((response) => (this.paymentsByTypeCollection = response))
    );
  }

  getTopFiveProductsReportByDay() {
    this.subscription.add(
      this.stadisticsService
        .getTop5ProductsByDay(this.currentUser.commerce, this.today)
        .subscribe((response) => (this.topFiveProductsReport = response))
    );
  }

  getTopFiveServicesReportByDay() {
    this.subscription.add(
      this.stadisticsService
        .getTop5ServicesByDay(this.currentUser.commerce, this.today)
        .subscribe((response) => (this.topFiveServicesReport = response))
    );
  }

  getReportFromBookingByWeek() {
    this.subscription.add(
      this.stadisticsService
        .getReportFromBookingByWeek(
          this.currentUser.commerce,
          this.week,
          Number.parseInt(this.year,10)
        )
        .subscribe((response) => {
          this.bookingReport = response;
          Array.from(Object.entries(this.bookingReport))
            .slice(0, Array.from(Object.entries(this.bookingReport)).length - 1)
            .forEach((item) => {
              this.pieChartDatasets[0].data.push(item[1]);
            });
        })
    );
  }

  getTopFiveCustomersReportByWeek() {
    this.subscription.add(
      this.stadisticsService
        .getTop5CustomersByWeek(
          this.currentUser.commerce,
          this.week,
          Number.parseInt(this.year,10)
        )
        .subscribe((response) => (this.topFiveCustomersReport = response))
    );
  }

  getTotalBillingByWeek() {
    const labels = [];
    const data = [];
    this.lineChartData = {
      datasets: [],
      labels: [],
    };
    this.subscription.add(
      this.stadisticsService
        .getTotalBillingByWeek(
          this.currentUser.commerce,
          this.week,
          Number.parseInt(this.year,10)
        )
        .subscribe((response) => {
          if (response) {
            response.forEach((item) => {
              labels.push(item[0]);
              data.push(item[1]);
            });
            this.totalBilling = response[response.length - 1][1];
            this.totalProductDisaggregated = response[response.length - 1][2];
            this.totalServiceDisaggregated = response[response.length - 1][3];
            this.totalOthersDisaggregated = response[response.length - 1][4];
          }
          const dataset = {
            data,
            label: `Facturación de la semana ${this.showRange} del ${this.year}`,
            fill: false,
            tension: 0.5,
            borderColor: 'rgba(255,122,34,49.3)',
            backgroundColor: 'rgba(255,0,0,0.3)',
          };
          this.lineChartData.datasets.push(dataset);
          this.lineChartData.labels = labels;
        })
    );
  }

  getNewCustomerReportByWeek() {
    this.subscription.add(
      this.stadisticsService
        .getNewCustomersByWeek(
          this.currentUser.commerce,
          this.week,
          Number.parseInt(this.year,10)
        )
        .subscribe((response: any) => (this.newCustomerReport = response))
    );
  }

  getTopPerformanceTeamByWeek() {
    this.subscription.add(
      this.stadisticsService
        .getTeamPerformanceByWeek(
          this.currentUser.commerce,
          this.week,
          Number.parseInt(this.year,10)
        )
        .subscribe((response) => {
          if (response) {
            this.performanceTeamReport = response;
            if (response.length > 0) {
              this.totalPercentage = this.performanceTeamReport[0].totalAmount;
            }
          }
        })
    );
  }

  getPaymentsByTypeAndWeek() {
    this.subscription.add(
      this.stadisticsService
        .getPaymentsByTypeAndWeek(
          this.currentUser.commerce,
          this.week,
          Number.parseInt(this.year,10)
        )
        .subscribe((response) => (this.paymentsByTypeCollection = response))
    );
  }

  getTopFiveProductsReportByWeek() {
    this.subscription.add(
      this.stadisticsService
        .getTop5ProductsByWeek(
          this.currentUser.commerce,
          this.week,
          Number.parseInt(this.year,10)
        )
        .subscribe((response) => (this.topFiveProductsReport = response))
    );
  }

  getTopFiveServicesReportByWeek() {
    this.subscription.add(
      this.stadisticsService
        .getTop5ServicesByWeek(
          this.currentUser.commerce,
          this.week,
          Number.parseInt(this.year,10)
        )
        .subscribe((response) => (this.topFiveServicesReport = response))
    );
  }

  getReportFromBookingByMonth() {
    this.subscription.add(
      this.stadisticsService
        .getReportFromBookingByMonth(this.currentUser.commerce, this.month)
        .subscribe((response) => {
          this.bookingReport = response;
          Array.from(Object.entries(this.bookingReport))
            .slice(0, Array.from(Object.entries(this.bookingReport)).length - 1)
            .forEach((item) => {
              this.pieChartDatasets[0].data.push(item[1]);
            });
        })
    );
  }

  getTopFiveCustomersReportByMonth() {
    this.subscription.add(
      this.stadisticsService
        .getTop5CustomersByMonth(this.currentUser.commerce, this.month)
        .subscribe((response) => (this.topFiveCustomersReport = response))
    );
  }

  getTotalBillingByMonth() {
    const labels = [];
    const data = [];
    this.lineChartData = {
      datasets: [],
      labels: [],
    };
    this.subscription.add(
      this.stadisticsService
        .getTotalBillingByMonth(this.currentUser.commerce, this.month)
        .subscribe((response) => {
          if (response) {
            response.forEach((item) => {
              labels.push(format(new Date(item[0]), 'MMM', { locale: es }));
              data.push(item[1]);
            });
            this.totalBilling = response[response.length - 1][1];
            this.totalProductDisaggregated = response[response.length - 1][2];
            this.totalServiceDisaggregated = response[response.length - 1][3];
            this.totalOthersDisaggregated = response[response.length - 1][4];
          }
          const dataset = {
            data,
            label: `Facturación ${this.monthName} ${this.year}`,
            fill: false,
            tension: 0.5,
            borderColor: 'rgba(255,122,34,49.3)',
            backgroundColor: 'rgba(255,0,0,0.3)',
          };
          this.lineChartData.datasets.push(dataset);
          this.lineChartData.labels = labels;
        })
    );
  }

  getNewCustomerReportByMonth() {
    this.subscription.add(
      this.stadisticsService
        .getNewCustomersByMonth(this.currentUser.commerce, this.month)
        .subscribe((response: any) => (this.newCustomerReport = response))
    );
  }

  getTopPerformanceTeamByMonth() {
    this.subscription.add(
      this.stadisticsService
        .getTeamPerformanceByMonth(this.currentUser.commerce, this.month)
        .subscribe((response) => {
          if (response) {
            this.performanceTeamReport = response;
            if (response.length > 0) {
              this.totalPercentage = this.performanceTeamReport[0].totalAmount;
            }
          }
        })
    );
  }

  getPaymentsByTypeAndMonth() {
    this.subscription.add(
      this.stadisticsService
        .getPaymentsByTypeAndMonth(this.currentUser.commerce, this.month)
        .subscribe((response) => (this.paymentsByTypeCollection = response))
    );
  }

  getTopFiveProductsReportByMonth() {
    this.subscription.add(
      this.stadisticsService
        .getTop5ProductsByMonth(this.currentUser.commerce, this.month)
        .subscribe((response) => (this.topFiveProductsReport = response))
    );
  }

  getTopFiveServicesReportByMonth() {
    this.subscription.add(
      this.stadisticsService
        .getTop5ServicesByMonth(this.currentUser.commerce, this.month)
        .subscribe((response) => (this.topFiveServicesReport = response))
    );
  }

  getReportFromBookingByYear() {
    this.subscription.add(
      this.stadisticsService
        .getReportFromBookingByYear(this.currentUser.commerce, this.year)
        .subscribe((response) => {
          this.bookingReport = response;
          Array.from(Object.entries(this.bookingReport))
            .slice(0, Array.from(Object.entries(this.bookingReport)).length - 1)
            .forEach((item) => {
              this.pieChartDatasets[0].data.push(item[1]);
            });
        })
    );
  }

  getTopFiveCustomersReportByYear() {
    this.subscription.add(
      this.stadisticsService
        .getTop5CustomersByYear(this.currentUser.commerce, this.year)
        .subscribe((response) => (this.topFiveCustomersReport = response))
    );
  }

  getTotalBillingByYear() {
    const labels = [];
    const data = [];
    this.lineChartData = {
      datasets: [],
      labels: [],
    };
    this.subscription.add(
      this.stadisticsService
        .getTotalBillingByYear(this.currentUser.commerce, this.year)
        .subscribe((response) => {
          if (response) {
            response.forEach((item) => {
              labels.push(item[0]);
              data.push(item[1]);
            });
            this.totalBilling = response[response.length - 1][1];
            this.totalProductDisaggregated = response[response.length - 1][2];
            this.totalServiceDisaggregated = response[response.length - 1][3];
            this.totalOthersDisaggregated = response[response.length - 1][4];
          }
          const dataset = {
            data,
            label: `Facturación del ${this.year}`,
            fill: false,
            tension: 0.5,
            borderColor: 'rgba(255,122,34,49.3)',
            backgroundColor: 'rgba(255,0,0,0.3)',
          };
          this.lineChartData.datasets.push(dataset);
          this.lineChartData.labels = labels;
        })
    );
  }

  getNewCustomerReportByYear() {
    this.subscription.add(
      this.stadisticsService
        .getNewCustomersByYear(this.currentUser.commerce, this.year)
        .subscribe((response: any) => (this.newCustomerReport = response))
    );
  }

  getTopPerformanceTeamByYear() {
    this.subscription.add(
      this.stadisticsService
        .getTeamPerformanceByYear(this.currentUser.commerce, this.year)
        .subscribe((response) => {
          if (response) {
            this.performanceTeamReport = response;
            if (response.length > 0) {
              this.totalPercentage = this.performanceTeamReport[0].totalAmount;
            }
          }
        })
    );
  }

  getPaymentsByTypeAndYear() {
    this.subscription.add(
      this.stadisticsService
        .getPaymentsByTypeAndYear(
          this.currentUser.commerce,
          Number.parseInt(this.year,10)
        )
        .subscribe((response) => (this.paymentsByTypeCollection = response))
    );
  }

  getTopFiveProductsReportByYear() {
    this.subscription.add(
      this.stadisticsService
        .getTop5ProductsByYear(
          this.currentUser.commerce,
          Number.parseInt(this.year,10)
        )
        .subscribe((response) => (this.topFiveProductsReport = response))
    );
  }

  getTopFiveServicesReportByYear() {
    this.subscription.add(
      this.stadisticsService
        .getTop5ServicesByYear(
          this.currentUser.commerce,
          Number.parseInt(this.year,10)
        )
        .subscribe((response) => (this.topFiveServicesReport = response))
    );
  }

  calculatePercentage(total: number): number {
    if (total === this.totalPercentage) {
      return 1;
    }
    return (total * 100) / this.totalPercentage / 100;
  }

  async presentSelectTimeSlotActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccione un rango',
      buttons: [
        {
          text: 'Día',
          role: 'modal-day',
          data: 'day',
          handler: () => {
            //this.showDaySelector = false;
          },
        },
        {
          text: 'Semana',
          role: 'modal-week',
          data: 'week',
          handler: () => {
            //this.showWeekSelector = false;
          },
        },
        {
          text: 'Mes',
          role: 'modal-month',
          data: 'month',
          handler: () => {},
        },
        {
          text: 'Año',
          role: 'modal-year',
          data: 'year',
          handler: () => {},
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'destructive',
        },
      ],
    });
    await actionSheet.present();
    const { role, data } = await actionSheet.onDidDismiss();

    this.selectedTimeRange = data;
    const modal: any = document.getElementById(role);
    if (modal) {
      await modal.present();
    } else if (data === 'week') {
      this.openPickerStartWeek();
    } else if (data === 'day') {
      this.openPickerStartDay();
    }
  }

  sideLeftChanged(event): void {
    this.year = event.value;
    this.weeksCollection = this.utilsService
      .getAllWeeks(Number.parseInt(event.value.toString(), 10))
      .map((item: any) => {
        const newSelector: Selector = new Selector();
        newSelector.text = item[0];
        newSelector.value = item[1];
        newSelector.isInitial = item[1] === getWeek(new Date());
        return newSelector;
      });
    this.cd.detectChanges();
  }

  sideRightChanged(event): void {
    this.week = event.value;
  }

  dismissWeek(modalId: string) {
    const modal: any = document.getElementById(modalId);
    this.showWeekSelector = false;
    this.showRange = this.weeksCollection.find(
      (item) => item.value === this.week
    ).text;
    this.getInfoByWeek();
    modal.dismiss();
  }
  dismissDay(modalId: string) {
    const modal: any = document.getElementById(modalId);
    this.showDaySelector = false;
    this.showRange = this.today
      ? format(new Date(this.today), 'dd MMMM yyyy', { locale: es })
      : 'Hoy';
    this.daySelected.setValue(this.today);
    this.getInfoByDay();
    modal.dismiss();
  }

  async dismissModal(modalId: string) {
    const modal: any = document.getElementById(modalId);
    if (modal) {
      switch (this.selectedTimeRange) {
        case 'day':
          this.showRange = this.daySelected.value
            ? format(new Date(this.daySelected.value), 'dd MMMM yyyy', {
                locale: es,
              })
            : 'Hoy';
          this.today = this.daySelected.value
            ? format(new Date(this.daySelected.value), 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd');
          this.getInfoByDay();
          break;

        case 'month':
          this.showRange = this.monthSelected.value
            ? format(new Date(this.monthSelected.value), 'MMMM yyyy', {
                locale: es,
              })
            : format(new Date(), 'MMMM yyyy', { locale: es });
          this.month = this.monthSelected.value
            ? format(new Date(this.monthSelected.value), 'yyyy-MM')
            : format(new Date(), 'yyyy-MM');
          this.monthName = this.monthSelected.value
            ? format(new Date(this.monthSelected.value), 'MMMM', { locale: es })
            : format(new Date(), 'MMMM', { locale: es });
          this.getInfoByMonth();
          break;

        case 'year':
          this.year = this.yearSelected.value
            ? format(new Date(this.yearSelected.value), 'yyyy')
            : format(new Date(), 'yyyy');
          this.showRange = this.year;
          this.getInfoByYear();
          break;
      }
      modal.dismiss();
    }
  }

  dateChanged(value: Date) {
    this.today = format(value, 'yyyy-MM-dd');
  }

  goToPaymentPendingBooking() {
    this.navCtrl.navigateForward(['non-payments'], {
      state: {
        paymentPendingBookingCollection: this.bookingReport.payment_pending,
      },
      relativeTo: this.activatedRoute,
    });
  }

  calculateTotalAmountProduct(arrayReport: any[]) {
    let total = 0;
    arrayReport.forEach((item) => {
      total += item.totalAmount;
    });
    return total;
  }

  toNumber(text: string): number {
    return Number.parseInt(text,10);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async openPickerStartDay() {
    const picker = await this.pickerCtrl.create({
      columns: this.pickerColumns,
      cssClass: 'my-picker',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: (value) => {
       
            const date = new Date(value.year.value,value.month.value,value.day.value);
       
            this.showRange = date
      ? format(new Date(date), 'dd MMMM yyyy', { locale: es })
      : 'Hoy';
            this.today = date.toISOString();
            this.daySelected.setValue(date);
            this.getInfoByDay();
           
          },
        },
      ],
    });

    await picker.present();
  }


  async openPickerStartWeek() {
    const picker = await this.pickerCtrl.create({
      columns: this.pickerColumnsWeek,
      cssClass: 'my-picker',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: (value) => {
    
           this.showRange = value.week.text;
           this.week = value.week.value[1];
          this.getInfoByWeek();
          },
        },
      ],
    });

    await picker.present();
  }
generateWeekSelector(): PickerColumn[]{
  const optionsYearsCollection: PickerColumnOption[] = [];
  const optionsWeekCollection: PickerColumnOption[] = [];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  let yearIndex = 0;
  let weekIndex = 0;
  const selectedYear = new Date().getFullYear();
  const selectedWeek = getWeek(new Date());
   const week = this.utilsService
      .getAllWeeks(selectedYear);
     
      years.forEach((value: number, index: number) => {
        if(selectedYear === value){
          yearIndex = index;
        }
        const newoption: PickerColumnOption = {
          text: `${value}`,
          value,
        };
        optionsYearsCollection.push(newoption);
      });
      week.forEach((value: string, index: number) => {
        if(selectedWeek === index){
          weekIndex = index;
        }
        const newoption: PickerColumnOption = {
          text: `${value[0]}`,
          value,
        };
        optionsWeekCollection.push(newoption);
      });
      const newColumnWeek: PickerColumn = {
        name: 'week',
        options: optionsWeekCollection,
        columnWidth: '50%',
        selectedIndex: weekIndex,
      };
      const newColumnYears: PickerColumn = {
        name: 'year',
        options: optionsYearsCollection,
        columnWidth: '50%',
        selectedIndex: yearIndex,
      };
  
      return [newColumnWeek, newColumnYears];
}
  generateDaySelector(): PickerColumn[] {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
  const optionsDaysCollection: PickerColumnOption[] = [];
  const optionsMonthsCollection: PickerColumnOption[] = [];
  const optionsYearsCollection: PickerColumnOption[] = [];
  const selectedDay = new Date().getDay();
  
  const selectedMonth = new Date().getMonth();
  const selectedYear = new Date().getFullYear();
  let dayIndex = 0;
  let monthIndex = 0;
  let yearIndex = 0;
   const days = Array.from({ length: 31 }, (_, i) => i + 1);
   days.forEach((value: number, index: number) => {
    if(value === selectedDay){
      dayIndex = index+1;
    }
    const newoption: PickerColumnOption = {
      text: `${value}`,
      value,
    };
    optionsDaysCollection.push(newoption);
  });
  months.forEach((value: string, index: number) => {
    if(selectedMonth === (index + 1)){
      monthIndex = index;
    }
    const newoption: PickerColumnOption = {
      text: `${value}`,
      value: index,
    };
    optionsMonthsCollection.push(newoption);
  });
  
  
   const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
   years.forEach((value: number, index: number) => {
    if(selectedYear === value){
      yearIndex = index;
    }
    const newoption: PickerColumnOption = {
      text: `${value}`,
      value,
    };
    optionsYearsCollection.push(newoption);
  });
    const newColumnDay: PickerColumn = {
      name: 'day',
      options: optionsDaysCollection,
      columnWidth: '50%',
      selectedIndex: dayIndex,
    };
    const newColumnMonth: PickerColumn = {
      name: 'month',
      options: optionsMonthsCollection,
      columnWidth: '50%',
      selectedIndex: monthIndex + 1,
    };
    const newColumnYears: PickerColumn = {
      name: 'year',
      options: optionsYearsCollection,
      columnWidth: '50%',
      selectedIndex: yearIndex,
    };

    return [newColumnDay, newColumnMonth, newColumnYears];
  }
}
