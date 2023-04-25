import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationCardComponent } from './notification-card.component';



@NgModule({
  declarations: [NotificationCardComponent],
  exports: [NotificationCardComponent],
  imports: [
    CommonModule
  ]
})
export class NotificationCardModule { }
