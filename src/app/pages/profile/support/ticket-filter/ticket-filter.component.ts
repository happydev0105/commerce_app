import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ticket-filter',
  templateUrl: './ticket-filter.component.html',
  styleUrls: ['./ticket-filter.component.scss'],
})
export class TicketFilterComponent implements OnInit {

  @Input() filterApplied: string;

  ticketStatusFilter = '';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.ticketStatusFilter = this.filterApplied ? this.filterApplied : 'pending';
  }

  dismiss(cancel: boolean) {
    cancel ? this.modalCtrl.dismiss() : this.modalCtrl.dismiss({filter: this.ticketStatusFilter});
  }

}
