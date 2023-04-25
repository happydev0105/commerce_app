import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Selector } from 'src/app/core/models/selector.model';
import Swiper from 'swiper';

@Component({
  selector: 'app-dynamic-selector',
  templateUrl: './dynamic-selector.component.html',
  styleUrls: ['./dynamic-selector.component.scss'],
})
export class DynamicSelectorComponent implements OnInit {

  @Input() sideLeft: Selector[];
  @Input() sideRight: Selector[];
  @Output() sideLeftChanged: EventEmitter<Selector> = new EventEmitter();
  @Output() sideRightChanged: EventEmitter<Selector> = new EventEmitter();

  seletedLeft: Selector;
  seletedRight: Selector;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  getInitialSlide(selectorCollection: Selector[]): number {
    const findIndex = selectorCollection.findIndex(item => item.isInitial);
    return findIndex < 0 ? 0 : findIndex;
  }

  onSlideSideLeftChange(event: [swiper: Swiper]) {
    this.sideLeftChanged.emit(this.sideLeft[event[0].activeIndex]);

  }

  onSlideSideRightChange(event: [swiper: Swiper]) {
    this.sideRightChanged.emit(this.sideRight[event[0].activeIndex]);
    this.seletedRight = this.sideRight[event[0].activeIndex];
  }

  dismiss() {
    this.modalCtrl.dismiss({ year: this.seletedLeft, week: this.seletedRight });
  }
}
