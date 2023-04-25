import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { FormatHourPipe } from "./format-hour.pipe";

@NgModule({
  declarations: [FormatHourPipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [FormatHourPipe]
})

export class FormatHourModule {}
