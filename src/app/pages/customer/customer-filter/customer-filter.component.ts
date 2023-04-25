import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-filter',
  templateUrl: './customer-filter.component.html',
  styleUrls: ['./customer-filter.component.scss'],
})
export class CustomerFilterComponent implements OnInit {

  customerFilter = 'faithful';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  dismiss(cancel: boolean) {
    if (!cancel) {
      this.modalCtrl.dismiss({
        filter: this.customerFilter
      });
    } else {
      this.modalCtrl.dismiss();
    }

  }

}
