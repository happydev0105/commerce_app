import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { Notifications } from 'src/app/core/models/notifications/notifications.model';
import { NotificationsService } from 'src/app/core/services/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit, OnDestroy {

  public notificationsCollection = [];

  public currentUser: Employee;

  subscription: Subscription = new Subscription();

  constructor(private router: Router,
    private notiifcationService: NotificationsService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.router.getCurrentNavigation().extras.state) {
      if (this.router.getCurrentNavigation().extras.state.notifications) {
        this.notificationsCollection = this.groupByCreatedGroup([...this.router.getCurrentNavigation().extras.state.notifications]);
        const reversed = {};
        for (const [key, value] of Object.entries(this.notificationsCollection).reverse()) {
          reversed[key] = value;
        }
        this.notificationsCollection = Object.entries(reversed);
      }
    }
  }



  ngOnInit() {
    this.checkAllNotificationsAsReadAfterThreeSeconds();
  }

  checkAllNotificationsAsReadAfterThreeSeconds() {
    setTimeout(() => {
      this.subscription.add(this.notiifcationService.markAsRead(this.currentUser.uuid).subscribe(res => console.log(res)));
    }, 3000);


  }

  goToDetail(notification: Notifications): void {
    if (notification.type === 'Book') {

      this.navCtrl.navigateForward([`booking/${notification.relatedUuid}`], { relativeTo: this.activatedRoute });
    }
    else {
      this.navCtrl.navigateForward([`reviews`], { relativeTo: this.activatedRoute });
    }

  }
  groupByCreatedGroup(array): any {
    return array.sort((a, b) => {
      // Compare the createdGroup fields in descending order
      if (a.createdGroup > b.createdGroup) { return 1; }
      if (a.createdGroup < b.createdGroup) { return -1; }
      return 0;
    }).reduce((groups, item) => {
      // Group the items by createdGroup value
      const group = item.createdGroup;
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
