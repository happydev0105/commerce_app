import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
})
export class DateSelectorComponent implements OnInit {
  @Output() dateEmitter: EventEmitter<Date> = new EventEmitter();

  months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  days = Array.from({ length: 31 }, (_, i) => i + 1);

  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  selectedMonth = new Date().getMonth();
  selectedDay = new Date().getDate();
  selectedYear = new Date().getFullYear();
  constructor(private modalCtrl: ModalController, private cd: ChangeDetectorRef) { }

  updateDays() {
    const date = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    const monthLength = date.getDate();
    this.days = [...Array.from({ length: monthLength }, (_, i) => i + 1)];
    this.dateEmitter.emit(new Date(this.selectedYear, this.selectedMonth, this.selectedDay))
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.dateEmitter.emit(new Date(this.selectedYear, this.selectedMonth, this.selectedDay))
  }

  getInitialDaySlide(days: number[]): number {
    const findIndex = days.findIndex(item => item === this.selectedDay);
    return findIndex < 0 ? 0 : findIndex;
  }
  getInitialMonthSlide(months: string[]): number {
    const findIndex = months.findIndex((item, index) => index === this.selectedMonth);
    return findIndex < 0 ? 0 : findIndex;
  }
  getInitialYearSlide(years: number[]): number {
    const findIndex = years.findIndex(item => item === this.selectedYear);
    return findIndex < 0 ? 0 : findIndex;
  }
  onSlideSideDayChange(day: any) {
    this.selectedDay = this.days[day[0].activeIndex];
    this.dateEmitter.emit(new Date(this.selectedYear, this.selectedMonth, this.selectedDay))
  }
  onSlideSideYearChange(year: any) {
    this.selectedYear = this.years[year[0].activeIndex];
    this.updateDays();
  }
  onSlideSideMonthChange(month: any) {
    this.selectedMonth = month[0].activeIndex;
    this.updateDays();
  }
  dismiss() {
    this.dateEmitter.emit(new Date(this.selectedYear, this.selectedMonth, this.selectedDay))
    this.modalCtrl.dismiss({ year: this.selectedYear, months: this.selectedMonth, day: this.selectedDay });
  }
}
