import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeeklySwipeComponent } from './weekly-swipe.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [WeeklySwipeComponent],
  imports: [CommonModule],
  exports: [WeeklySwipeComponent],
})
export class WeeklySwipeModule {}
