import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-sms-confirmation',
  templateUrl: './sms-confirmation.page.html',
  styleUrls: ['./sms-confirmation.page.scss'],
})
export class SmsConfirmationPage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  goHome() {
    this.navCtrl.navigateForward(['tabs/home']);
  }

}
