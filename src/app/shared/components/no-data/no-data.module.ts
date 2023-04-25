import { NoDataComponent } from './no-data.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NoDataComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [NoDataComponent]
})
export class NoDataModule { }
