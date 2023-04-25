import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Booking } from 'src/app/core/models/reservation.model';
import { groupBy } from 'lodash';

@Component({
  selector: 'app-non-payments',
  templateUrl: './non-payments.page.html',
  styleUrls: ['./non-payments.page.scss'],
})
export class NonPaymentsPage implements OnInit {

  nonPaymentBookingCollection: Booking[] = [];
  groupByDateCollection = [];

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.nonPaymentBookingCollection = this.router.getCurrentNavigation().extras.state.paymentPendingBookingCollection;
      this.groupByDateCollection = Object.values(groupBy(this.nonPaymentBookingCollection, (booking: Booking) => booking.startsDay));
      this.groupByDateCollection[0].sort((a, b) => {
        if (a.startsHour < b.startsHour) return -1;
        if (a.startsHour > b.startsHour) return 1;
        if (a.startsMinute < b.startsMinute) return -1;
        if (a.startsMinute > b.startsMinute) return 1;
        return 0;
    });
    }
  }

  ngOnInit() {
  }

  goBooking(booking: Booking) {
    this.navCtrl.navigateForward([`booking/${booking.uuid}`], {
      relativeTo: this.activatedRoute
    });
  }

}
