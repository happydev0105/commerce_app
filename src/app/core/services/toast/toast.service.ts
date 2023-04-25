import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async presentToast(message: string, success: boolean) {
    try {
      this.toastController.dismiss().then(() => { }).catch(() => { }).finally(() => { });
    } catch (e) { }
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      cssClass: success ? 'toast-success' : 'toast-error',
      buttons: [
        {
          side: 'start',
          icon: success ? 'checkmark-outline' : 'close-circle-outline',
        },
      ],
    });
    toast.present();
  }
}
