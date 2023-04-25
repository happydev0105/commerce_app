import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeTableComponent } from './time-table.component';
import { IonicModule } from '@ionic/angular';
import { TimeTableHeaderEmployeeModule } from '../time-table-header-employee/time-table-header-employee.module';
import { ReservationCardModule } from '../reservation-card/reservation-card.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LongpressModule } from '../../directives/longpress/longpress.module';
import { AngularDraggableModule } from 'angular2-draggable';
import { ToColumnMoveModule } from '../../directives/toColumnMove/to-column-move.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EmployeeModule } from '../employee/employee.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { TimeframeModule } from '../../pipes/timeframe/timeframe.module';
import { BookingGridModule } from '../booking-grid/booking-grid.module';
import { CardInfoModule } from '../card-info/card-info.module';
@NgModule({
  declarations: [TimeTableComponent],
  imports: [
    CommonModule,
    IonicModule,
    TimeTableHeaderEmployeeModule,
    ReservationCardModule,
    DragDropModule,
    ScrollingModule,
    LongpressModule,
    AngularDraggableModule,
    ToColumnMoveModule,
    EmployeeModule,
    MatGridListModule,
    TimeframeModule,
    BookingGridModule,
    CardInfoModule
  ],
  exports: [TimeTableComponent],
})
export class TimeTableModule { }
