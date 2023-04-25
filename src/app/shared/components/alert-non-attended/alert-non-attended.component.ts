import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-alert-non-attended',
  templateUrl: './alert-non-attended.component.html',
  styleUrls: ['./alert-non-attended.component.scss'],
})
export class AlertNonAttendedComponent {
  @Input() title: string;
  @Output() actionEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public alertController: AlertController) {}
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.title,
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
