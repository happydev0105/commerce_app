import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateMonthsPipe } from "./translate-months.pipe";

@NgModule({
  declarations: [TranslateMonthsPipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [TranslateMonthsPipe]
})

export class TranslateMonthsModule {}
