import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeframePipe } from './timeframe.pipe';



@NgModule({
  declarations: [TimeframePipe],
  imports: [
    CommonModule
  ],
  exports:[TimeframePipe]
})
export class TimeframeModule { }
