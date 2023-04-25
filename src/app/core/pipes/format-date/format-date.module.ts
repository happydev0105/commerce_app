import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { FormatDatePipe } from "./format-date.pipe";

@NgModule({
  declarations: [FormatDatePipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [FormatDatePipe]
})

export class FormatDateModule {}
