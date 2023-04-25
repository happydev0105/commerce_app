import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateDaysPipe } from 'src/app/core/pipes/translate-days/translate-days.pipe';
import { TranslateDaysModule } from 'src/app/core/pipes/translate-days/translate-days.module';



@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateDaysModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
