import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeSelectorComponent } from './range-selector.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [RangeSelectorComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RangeSelectorComponent],
})
export class RangeSelectorModule { }
