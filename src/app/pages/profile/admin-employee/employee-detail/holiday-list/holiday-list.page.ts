import { NavController } from '@ionic/angular';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BehaviorSubject, Subscription } from 'rxjs';
import { INonAvailability } from 'src/app/core/interfaces/non-availability.interface';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { HolidayRange } from 'src/app/core/models/holidays/holiday-range.model';
import { NonAvailabilityService } from 'src/app/core/services/non-availability/non-availability.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.page.html',
  styleUrls: ['./holiday-list.page.scss'],
})
export class HolidayListPage implements OnInit, OnDestroy {
  @ViewChild(AlertComponent) deleteAlert: AlertComponent;
  employeeCollection: Employee[] = [];
  holidaysCollection: HolidayRange[];
  commerceLogged: string;
  employeeID: string;
  $removeItem: BehaviorSubject<HolidayRange> = new BehaviorSubject<HolidayRange>(null);
  subscription: Subscription = new Subscription();

  constructor(
    private navCtrl: NavController,
    private nonAvaService: NonAvailabilityService,
    private activatedRoute: ActivatedRoute) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
    this.holidaysCollection = [];
  }

  ionViewWillEnter() {
    this.holidaysCollection = [];
  }

  ngOnInit() {
    this.getParam();
  }

  getParam() {
    this.subscription.add(this.activatedRoute.params.subscribe((param: Params) => {
      this.employeeID = param.id;
      this.getAllHolydayGroupsByEmployee(this.employeeID);
    }));
  }



  getAllHolydayGroupsByEmployee(uuid: string) {
    this.subscription.add(this.nonAvaService.getHolidaysByEmployee(uuid).subscribe((res: INonAvailability[]) => {
      res.forEach((item: INonAvailability) => {
        this.getAllDayByHolidayGroup(item.groupBy);
      });

    }));
  }

  getAllDayByHolidayGroup(holydayCode: string) {
    this.subscription.add(this.nonAvaService.getHolidaysByCode(holydayCode).subscribe((res: INonAvailability[]) => {
      const mapped = res.filter((item: INonAvailability) => item.date = format(new Date(item.date), 'dd MMMM yyyy', { locale: es }));
      const newHolydayRange: HolidayRange = new HolidayRange();
      newHolydayRange.groupBy = holydayCode;
      newHolydayRange.first = mapped[0];
      newHolydayRange.last = mapped[res.length - 1];
      newHolydayRange.range = res;
      this.holidaysCollection.push(newHolydayRange);
      console.log(this.holidaysCollection);
    }));


  }

  goToCreate(): void {
    this.navCtrl.navigateForward([`holiday/${this.employeeID}`], { relativeTo: this.activatedRoute });
  }

  removeHolidayRange(item: HolidayRange) {
    this.subscription.add(this.nonAvaService.deleteHolidayById(item.groupBy).subscribe(res => {
      this.holidaysCollection = [];
      this.getParam();
    }));
  }
  openAlert(item: HolidayRange) {
    this.$removeItem.next(item);
    this.deleteAlert.presentAlertConfirm();
  }
  alertBox(confirm: boolean) {
    if (confirm) {
      this.removeHolidayRange(this.$removeItem.value);
    } else {
      this.$removeItem.next(null)
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
