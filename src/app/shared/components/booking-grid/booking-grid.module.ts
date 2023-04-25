import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingGridComponent } from './booking-grid.component';



@NgModule({
  declarations: [BookingGridComponent],
  exports: [BookingGridComponent],
  imports: [
    CommonModule
  ]
})
export class BookingGridModule { }
