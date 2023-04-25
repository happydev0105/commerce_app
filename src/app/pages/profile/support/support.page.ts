import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ticket } from 'src/app/core/models/ticket/ticket.model';
import { TicketFilterComponent } from './ticket-filter/ticket-filter.component';
import { TicketStatus } from 'src/app/core/models/enums/ticket-status.enum';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SupportService } from 'src/app/core/services/support/support.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit, OnDestroy {

  ticketCollection: Ticket[] = [];
  ticketCollectionFiltered: Ticket[] = [];
  filterApplied = 'all';
  commerceLogged: string;
  subscription: Subscription = new Subscription();

  constructor(
    private supportService: SupportService,
    private navCtrl: NavController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet, private authService: AuthService) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
  }


  ionViewWillEnter() {
    this.getAllTickets();
  }

  ngOnInit() { }

  getAllTickets() {
    this.subscription.add(this.supportService.getTicketsByCommerce(this.commerceLogged).subscribe(response => {
      this.ticketCollectionFiltered = response;
      this.ticketCollection = this.ticketCollectionFiltered.filter(ticket => ticket.status !== TicketStatus.FINISHED);
    }));
  }

  goToCreate() {
    this.navCtrl.navigateForward(['tabs/profile/support/support-ticket']);
  }

  goToDetail(ticket: Ticket) {
    const navigationExtras: NavigationExtras = {
      state: { ticket },
    };
    this.navCtrl.navigateForward(['tabs/profile/support/support-ticket'], navigationExtras);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: TicketFilterComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      backdropDismiss: false,
      componentProps: {
        filterApplied: this.filterApplied
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.filterApplied = data.filter;
      if (data.filter === 'all') {
        this.ticketCollection = this.ticketCollectionFiltered;
      } else {
        this.ticketCollection = this.ticketCollectionFiltered.filter(ticket => ticket.status === this.filterApplied);
      }
    } else {
      this.ticketCollection = this.ticketCollectionFiltered;
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
