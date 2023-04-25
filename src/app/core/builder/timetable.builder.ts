/* eslint-disable max-len */
import { addMinutes, differenceInMinutes, isPast } from 'date-fns';
import { BookingDto } from '../dto/booking.dto';
import { EDays } from '../enums/days.enum';
import { IRangeTimeTable } from '../interfaces/rangeTimetable.interface';
import { Employee } from '../models/employee/employee.model';
import { NonAvailability } from '../models/non-availability.model';
import { Booking } from '../models/reservation.model';
import { TimeTable } from '../models/time-table.model';
import { TimeTable as timetable } from '../models/timeTable/timeTable.model';
import { utcToZonedTime } from 'date-fns-tz';
import { FrameLabel } from '../interfaces/frame.label.interface';
export class TimeTableBuilder extends TimeTable {
  public setTimeFrames(newTimeFrames: FrameLabel[]): TimeTableBuilder {
    this.timeFrames = newTimeFrames;
    return this;
  }
  public setEmployees(newEmployees: Employee[]): TimeTableBuilder {
    this.employees = newEmployees;
    return this;
  }
  public setBookings(newBookings: Booking[]): TimeTableBuilder {
    this.bookings = newBookings;
    return this;
  }
  public setFreeTime(newFreeTime: NonAvailability[]): TimeTableBuilder {
    this.freeTime = this.setNonAvaliabilityAsBooking(newFreeTime);
    return this;
  }
  public setNonAvailability(
    newNonAvailability: NonAvailability[]
  ): TimeTableBuilder {
    this.bookings = this.bookings.concat(
      this.setNonAvaliabilityAsBooking(newNonAvailability)
    );
    return this;
  }
  public setStartOverTime(value: number): TimeTableBuilder {
    this.startOverTime = value;
    return this;
  }

  public setEndOverTime(value: number): TimeTableBuilder {
    this.endOverTime = value;
    return this;
  }

  public setIndexWeekDay(value: number): TimeTableBuilder {
    this.indexWeekDay = value;
    return this;
  }

  public setTimeTableCommerce(timetableCommerce: IRangeTimeTable): TimeTableBuilder {
    this.commerceTimeTable = timetableCommerce;
    return this;
  }

  public build(): TimeTable {
    const newTimetable: TimeTable = new TimeTable();
    if (this.commerceTimeTable.start.hour) {
      this.employees = [
        ...this.checkIfEmployeeWorks(this.employees, this.indexWeekDay),
      ];

    }
    newTimetable.startOverTime = this.startOverTime;
    newTimetable.endOverTime = this.endOverTime;
    newTimetable.columnWidth = this.setColumnWidthByEmployee(this.employees).columnWidth;

    newTimetable.tableWidth = this.setColumnWidthByEmployee(this.employees).tableWidth;
    newTimetable.draggableWidth = this.setColumnWidthByEmployee(this.employees).draggableWidth;
    newTimetable.timeFrames = this.timeFrames;
    newTimetable.employees = this.checkIfEmployeeHasBookingsWithOutPayment(this.employees, this.bookings);
    newTimetable.freeTime = this.calculateBookingPosition(
      this.checkIfExistEmployeeofBook(this.freeTime, this.employees),
      this.employees
    );
    newTimetable.bookings = this.calculateBookingPosition(
      this.checkIfExistEmployeeofBook(this.bookings, this.employees),
      this.employees
    );


    return newTimetable;
  }

  private checkIfEmployeeHasBookingsWithOutPayment(employees: Employee[], bookings: Booking[]): Employee[] {

    const currentDate = utcToZonedTime(new Date(), 'Europe/Paris');

    const updatedEmployees = employees.map(employee => {
      const pastUnpaidBookings = bookings.filter(booking => {
        if (booking.asignedTo.uuid === employee.uuid && !booking.payment && booking.status !== 'No asistida' && !booking.paymentSettedUuid && booking.isBooking) {
          const bookingDate = new Date(booking.startsDay);
          bookingDate.setHours(booking.startsHour);
          bookingDate.setMinutes(booking.startsMinute);
          bookingDate.setMinutes(bookingDate.getMinutes() + booking.duration);
          if (currentDate > bookingDate) {
            return true;
          }
        }
        return false;
      });
      if (pastUnpaidBookings.length > 0) {
        return { ...employee, hasUnpaidBooking: true };
      }
      return { ...employee, hasUnpaidBooking: false };
    });
    return updatedEmployees;
  }

  private checkIfExistEmployeeofBook(bookingCollection: Booking[], employeeCollection: Employee[]): Booking[] {
    const bookColletion = bookingCollection
      .filter((book: Booking) => employeeCollection.some((emp: Employee) => emp.uuid === book.asignedTo.uuid));
    return bookColletion;
  }
  private setColumnWidthByEmployee(employeeCollection: Employee[]): {
    columnWidth: number;
    tableWidth: string;
    draggableWidth: string;
  } {

    if (employeeCollection.length === 1) {
      const width = window.innerWidth - 41;
      localStorage.setItem('columnWidth', `${width}`);
      return {
        columnWidth: width,
        tableWidth: `${window.innerWidth}px`,
        draggableWidth: `${window.innerWidth}px`,

      };
    } else if (employeeCollection.length === 2) {
      const width = (window.innerWidth - 41) / 2;
      localStorage.setItem('columnWidth', `${width}`);
      const dragWidth = window.innerWidth - 41;
      return {
        columnWidth: width,
        tableWidth: `${window.innerWidth}px`,
        draggableWidth: `${dragWidth}px`,
      };
    } else {
      const width =
        (window.innerWidth - 41) / 3 > 150 ? (window.innerWidth - 41) / 3 : 150;
      localStorage.setItem('columnWidth', `${width}`);
      return {
        columnWidth: width,
        tableWidth: `100%`,
        draggableWidth: `${employeeCollection.length * width}px`,
      };
    }
  }

  private checkIfEmployeeWorks(
    employeeCollection: Employee[],
    indexWeekDay: number
  ): Employee[] {
    if (employeeCollection.length > 1) {
      return employeeCollection.filter((employee: Employee) =>
        this.checkWeekDAy(employee.timetable, indexWeekDay) && employee.isEmployee
      );
    }
    return employeeCollection;
  }
  private checkWeekDAy(timetableEmp: timetable, indexWeekDay: number): boolean {
    const day = EDays[indexWeekDay];
    const range: IRangeTimeTable = JSON.parse(timetableEmp[day]);
    if (!range.start.hour) {
      return false;
    }
    return true;
  }

  private setNonAvaliabilityAsBooking(
    nonAvailability: NonAvailability[]
  ): Booking[] {
    const newBookingCollection: Booking[] = [];
    nonAvailability.forEach((nonAva: NonAvailability) => {
      const nonAvaTimeTable: IRangeTimeTable = JSON.parse(nonAva.timetable);

      const newBook: Booking = new Booking();
      newBook.uuid = nonAva.uuid;
      if (nonAva.uuid.includes('fake-')) {
        newBook.isFreetime = true;
      } else {
        newBook.isFreetime = false;
      }
      newBook.asignedTo = nonAva.employee;
      newBook.commerce = nonAva.commerce;
      newBook.customer = null;
      newBook.message = nonAva.message;
      newBook.startsHour = nonAvaTimeTable.start.hour;
      newBook.startsMinute = nonAvaTimeTable.start.minute;
      newBook.isBooking = false;
      newBook.mobileSize = {
        width: 0,
        height: 0,
      };
      newBook.mobilePosition = {
        x: 0,
        y: 0,
      };
      newBook.startsDay = nonAva.date;
      newBook.duration = this.setNonAvailabilityDuration(nonAva);
      newBookingCollection.push(newBook);
    });
    return newBookingCollection;
  }

  private getEmployeeById(employee: Employee[], uuid: string): Employee {
    const employeeSelected = employee.find(
      (emp: Employee) => emp.uuid === uuid
    );
    return employeeSelected;
  }

  private calculateBookingPosition(
    booking: Booking[],
    employee: Employee[]
  ): Booking[] {
    return booking.map((bookItem: Booking) => {
      bookItem.mobilePosition = {
        x: this.getEmployeeIndexToAsignColumn(bookItem, employee),
        y: this.calcVerticalDistanceFromBookingHour(bookItem, this.timeFrames),
      };
      return bookItem;
    });
  }

  private getEmployeeIndexToAsignColumn(
    booking: Booking,
    employee: Employee[]
  ): number {
    const index = employee.findIndex(
      (employeeItem: Employee) => employeeItem.uuid === booking.asignedTo.uuid
    );

    return index * parseInt(localStorage.getItem('columnWidth'), 10); // TODO
  }

  private calcVerticalDistanceFromBookingHour(
    booking: Booking,
    timeFrames: FrameLabel[]
  ): number {
    const [firsFrame] = timeFrames;
    const hourAndMinuteSplitted = firsFrame.label.split(':');
    const hour = parseInt(hourAndMinuteSplitted[0], 10);
    const minute = parseInt(hourAndMinuteSplitted[1], 10);
    const bookingHour = booking.startsHour;
    const bookingMinute = booking.startsMinute;

    const hourDiff = (bookingHour - hour) * 60;
    const minuteDiff = bookingMinute - minute;
    let totalMinutes: number;

    if (minuteDiff > 0) {


      totalMinutes = hourDiff + minuteDiff;
    } else {

      totalMinutes = hourDiff - minuteDiff * -1;
    }
    const pixelsHeightOfEachFiveMinutes = 8;
    const rowInMinutes = 5;
    const totalPixels =
      (totalMinutes / rowInMinutes) * pixelsHeightOfEachFiveMinutes;


    return totalPixels;
  }

  private setNonAvailabilityDuration(nonAvailability: NonAvailability): number {
    const nonAvaTimeTable: IRangeTimeTable = JSON.parse(
      nonAvailability.timetable
    );
    const nonAvaStartDate: Date = new Date(
      2022,
      1,
      1,
      nonAvaTimeTable.start.hour,
      nonAvaTimeTable.start.minute
    );
    const nonAvaEndDate: Date = new Date(
      2022,
      1,
      1,
      nonAvaTimeTable.end.hour,
      nonAvaTimeTable.end.minute
    );
    return differenceInMinutes(nonAvaEndDate, nonAvaStartDate);
  }
}
