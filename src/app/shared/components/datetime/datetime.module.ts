import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatetimeComponent } from './datetime.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [DatetimeComponent],
  imports: [CommonModule, IonicModule],
  exports: [DatetimeComponent],
})
export class DatetimeModule {}
