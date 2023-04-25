import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateDaysPipe } from "./translate-days.pipe";

@NgModule({
  declarations: [TranslateDaysPipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [TranslateDaysPipe]
})

export class TranslateDaysModule {}
