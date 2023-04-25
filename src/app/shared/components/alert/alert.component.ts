import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() title: string;
  @Input() message: string;
  @Output() actionEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public alertController: AlertController) {}
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.title,
      message: this.message ? this.message : '',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            this.actionEmitter.emit(false);
          },
        },
        {
          text: 'Aceptar',
          id: 'confirm-button',
          handler: () => {
            this.actionEmitter.emit(true);
          },
        },
      ],
    });

    await alert.present();
  }
}
