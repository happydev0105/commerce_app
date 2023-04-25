import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationCardComponent } from './reservation-card.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ReservationCardComponent],
  imports: [CommonModule, IonicModule],
  exports: [ReservationCardComponent],
})
export class ReservationCardModule {}
