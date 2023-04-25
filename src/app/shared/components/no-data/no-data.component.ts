import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent implements OnInit {

  @Input() title: string;
  @Input() content = true;
  @Input() hasTitle = true;

  public isReady= false;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.isReady = true
    }, 1000);
  }

}
