import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
})
export class DatetimeComponent implements OnInit {
  @Input() actualDate: string;

  viewDateTime: boolean;

  constructor() {
    this.viewDateTime = false;
  }

  ngOnInit() {}

  toogle(): void {
    this.viewDateTime = !this.viewDateTime;
  }
}
