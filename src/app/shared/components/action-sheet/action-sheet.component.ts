import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Longpress } from 'src/app/core/interfaces/longpress.interface';
import { EditBooking } from 'src/app/core/utils/editBooking.service';

@Component({
  selector: 'app-action-sheet',
  templateUrl: './action-sheet.component.html',
  styleUrls: ['./action-sheet.component.scss'],
})
export class ActionSheetComponent implements OnInit {
  actionSheet: HTMLIonActionSheetElement;
  constructor(
    public actionSheetController: ActionSheetController,
    private modalOppened: EditBooking,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute
  ) {
  }
  ngOnInit() { }
  async presentActionSheet(bookingData: Longpress, selectedDay: string) {
    const navigationExtras: NavigationExtras = {
      state: { selectedDay },
      relativeTo: this.activatedRoute
    };
    if (bookingData) { navigationExtras.state.bookingData = bookingData; };
    this.actionSheet = await this.actionSheetController.create({
      backdropDismiss: true,
      buttons: [
        {
          text: 'Crear cita',
          role: 'booking',
          data: bookingData,
          handler: () => {
            this.navCtrl.navigateForward(['new-booking'], navigationExtras);
          },
        },
        {
          text: 'Reserva de tiempo',
          role: 'non-availability',
          data: bookingData,
          handler: () => {
            this.navCtrl.navigateForward(['non-availability'], navigationExtras);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'destructive',
          handler: () => {
            this.modalOppened.modalOppened.next(false);
          },
        },
      ],
    });
    await this.actionSheet.present();

    await this.actionSheet.onDidDismiss().then(() => this.modalOppened.modalOppened.next(false))
    this.modalOppened.modalOppened.next(true);
  }

}
