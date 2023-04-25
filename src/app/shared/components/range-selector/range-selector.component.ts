import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { subMonths } from 'date-fns';
import { DateService } from 'src/app/core/utils/date.service';
import { es } from 'date-fns/locale';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-range-selector',
  templateUrl: './range-selector.component.html',
  styleUrls: ['./range-selector.component.scss'],
})
export class RangeSelectorComponent implements OnInit {

  endDate: string = subMonths(new Date(), 1).toISOString();
  startDate: string = new Date().toISOString();
  form: FormGroup;
  locale = es;
  constructor(public dateService: DateService, private fb: FormBuilder, private modal: ModalController) { }

  ngOnInit() {
    this.initForm();
  }
  initForm(): void {
    this.form = this.fb.group({
      startDay: [this.endDate, Validators.required],
      endDay: [this.startDate, Validators.required]
    });
  }
  dateStartChanged(date) {
    console.log(date);

  }
  dateEndChanged(date) {
    console.log(date);

  }

  dismiss(): void {
    this.modal.dismiss();
  }
  dismissWithData() {
    this.modal.dismiss({ start: this.form.get('startDay').value, end: this.form.get('endDay').value });
  }
}
