import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardInfoComponent } from './card-info.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [CardInfoComponent],
  exports: [CardInfoComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class CardInfoModule { }
