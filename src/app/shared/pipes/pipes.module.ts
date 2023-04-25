import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStatusPipe } from './booking-status.pipe';


@NgModule({
  declarations: [ BookingStatusPipe],
  imports: [
    CommonModule
  ],
  exports: [ BookingStatusPipe]
})
export class PipesModule { }
