import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LongPressDirective } from './longpress.directive';

@NgModule({
  declarations: [LongPressDirective],
  exports: [LongPressDirective],
  imports: [CommonModule],
})
export class LongpressModule {}
