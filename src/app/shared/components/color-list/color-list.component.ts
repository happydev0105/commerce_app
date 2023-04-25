import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EColors } from 'src/app/core/enums/colors.enum';

@Component({
  selector: 'app-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss'],
})
export class ColorListComponent implements OnInit {

  colorsCollection: string[] = [];
  colorsSelected: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.buildColorsCollection();
  }

  buildColorsCollection() {
    Object.keys(EColors).forEach((color: string) => {
      this.colorsCollection.push(color);
    });
  }

  selectColor(item: string): void {
    this.colorsSelected = item;
    this.dismiss(true);
  }

  dismiss(isSelected: boolean) {
    if (isSelected) {
      this.modalCtrl.dismiss({
        color: this.colorsSelected,
      });
    }
    else {
      this.modalCtrl.dismiss();
    }
  }
}
