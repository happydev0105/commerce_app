import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-avatar-initials',
  templateUrl: './avatar-initials.component.html',
  styleUrls: ['./avatar-initials.component.scss'],
})
export class AvatarInitialsComponent implements OnInit, OnChanges {

  @Input() name: string;
  @Input() surname: string;
  @Input() isCustomer = true;

  initials = '';

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.getInitials();
  }

  getInitials() {
    let initials = this.name.slice(0, 2).toUpperCase();
    if (this.surname) {
      initials = `${this.name.slice(0, 1).toUpperCase()}${this.surname.slice(0, 1).toUpperCase()}`;
    }
    this.initials = initials;
  }

  ngOnInit() { }

}
