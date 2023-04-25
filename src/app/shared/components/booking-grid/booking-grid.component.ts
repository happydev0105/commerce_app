/* eslint-disable max-len */
import { Component, Input, OnInit } from '@angular/core';
import { addMinutes } from 'date-fns';
import { Booking } from 'src/app/core/models/reservation.model';

@Component({
  selector: 'app-booking-grid',
  templateUrl: './booking-grid.component.html',
  styleUrls: ['./booking-grid.component.scss'],
})
export class BookingGridComponent implements OnInit {

  @Input() bookings: Booking[];
  @Input() columnWidth: number;
  rowHeight = 24; // Set a fixed row height in pixels
  numRows: number;
  gridTemplateRows: string;

  ngOnInit() {
    // Calculate the number of rows needed based on the bookings array

    const earliestStartTime = Math.min(...this.bookings.map(booking => this.getStartTime(booking)));
    const latestEndTime = Math.max(...this.bookings.map(booking => this.getEndTime(booking)));
    const totalDuration = (latestEndTime - earliestStartTime) / (1000 * 60);
    this.numRows = Math.ceil(totalDuration / 5); // Assume a fixed time interval of 30 minutes

    // Set the CSS grid template rows based on the number of rows
    this.gridTemplateRows = `repeat(${this.numRows}, ${this.rowHeight}px)`;
  }
  calculateTop(booking: Booking): string {
    const earliestStartTime = Math.min(...this.bookings.map(b => this.getStartTime(b)));
    const timeDiff = this.getStartTime(booking) - earliestStartTime;
    const row = Math.floor(timeDiff / (30 * 60 * 1000)); // Assume a fixed time interval of 30 minutes
    return `${row * this.rowHeight}px`;
  }

  calculateLeft(index: number): string {
    // Calculate the left position based on the column of the booking
    return `${index * 100}px`; // Assume each column is 100 pixels wide
  }

  calculateHeight(booking: Booking): string {
    const duration = (this.getStartTime(booking) - this.getStartTime(booking)) / (1000 * 60);
    const numCells = Math.ceil(duration / 30); // Assume a fixed time interval of 30 minutes
    return `${numCells * this.rowHeight}px`;
  }

  getEndTime(booking: Booking): number {
    return addMinutes(new Date(2023, 1, 1, booking.startsHour, booking.startsMinute), booking.duration).getTime();
  }
  getStartTime(booking: Booking): number {
    return new Date(2023, 1, 1, booking.startsHour, booking.startsMinute).getTime();
  }

}
