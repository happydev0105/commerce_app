import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToColumnMoveDirective } from './to-column-move.directive';

@NgModule({
  declarations: [ToColumnMoveDirective],
  exports: [ToColumnMoveDirective],
  imports: [CommonModule],
})
export class ToColumnMoveModule {}
