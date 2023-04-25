import { AlertController, NavController } from '@ionic/angular';
import { SubscriptionService } from './../../../../core/services/subscription/subscription.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'src/app/core/models/subscription/subscription.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  subscription: Subscription;
  detailsSplitted: string[] = [];
  viewDetailText = 'Ver detalles';
  commerceLogged: string;
  constructor(
    private subscriptionService: SubscriptionService,
    private navCtrl: NavController,
    private toastService: ToastService,
    private alertController: AlertController, private authService: AuthService) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
    this.getSubscription();
  }


  ngOnInit() { }

  getSubscription() {
    this.subscriptionService.getByCommerce(this.commerceLogged).subscribe(response => {
      if (response) {
        this.subscription = response;
        this.detailsSplitted = this.subscription.details.split(',');
      }
    });
  }

  onChange(event) {
    !event.detail.value ? this.viewDetailText = 'Ver detalles' : this.viewDetailText = 'Ocultar detalles';
  }


  async editAccountNumber() {
    const editAccountAlert = await this.alertController.create({
      header: 'Editar nº de cuenta',
      inputs: [
        {
          name: 'numberAccount',
          type: 'text',
          placeholder: this.subscription.accountNumber,
          value: this.subscription.accountNumber
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'destructive',
        }, {
          text: 'Aceptar',
          handler: (data) => {
            this.subscription.accountNumber = data.numberAccount;
            this.subscriptionService.updateSubscription(this.subscription)
              .subscribe(response => {
                this.subscription = response;
              });
          }
        }]
    });
    await editAccountAlert.present();
  }

  cancel() {
    this.navCtrl.navigateBack(['tabs/profile/commerce-info'], { replaceUrl: true });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Desea cancelar su cuenta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
         
        },
        {
          text: 'Aceptar',
          id: 'confirm-button',
          handler: () => {
            this.cancelAccount();
          },
        },
      ],
    });

    await alert.present();
  }

  cancelAccount(){
    this.subscriptionService.cancelSubscription(this.commerceLogged).subscribe(res => {
      this.toastService.presentToast('Hemos enviado un email a su correo para proceder con el proceso de baja', true);
    });
  }

}
