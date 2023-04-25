import { Employee } from 'src/app/core/models/employee/employee.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, IonRouterOutlet, IonTabs, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  @ViewChildren(IonRouterOutlet) routerOutlets: IonRouterOutlet;
  @ViewChild('tabs', { static: false }) tabs: IonTabs;

  selectedTab: string;
  currentUser: Employee;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  constructor(
    public authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private platform: Platform,
    public alertController: AlertController,
    private location: Location) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.backButtonEvent();
  }

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();

    const setStatusBarStyleDark = async () => {
      await StatusBar.setStyle({ style: Style.Light });
    };
    const setOverlaysWebView = async () => {
      await StatusBar.setOverlaysWebView({ overlay: false });
    };

    setStatusBarStyleDark();
    setOverlaysWebView();
    this.navCtrl.navigateRoot([`tabs/${this.tabs.getSelected()}`], { replaceUrl: true })

  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, (event) => {

      if (this.router.url === '/tabs/profile'
        || this.router.url === '/tabs/payments'
        || this.router.url === '/tabs/customers') {
        this.router.navigate(['/tabs/home']);
      } else if (this.router.url === '/tabs/home') {
        this.presentAlertConfirm()
      } else {
        this.location.back();
      }
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      // header: 'Confirm!',
      message: '¿Desea salir de Yeasy?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => { }
      }, {
        text: 'Salir',
        handler: () => {
          App.exitApp();
        }
      }]
    });

    await alert.present();
  }

}
