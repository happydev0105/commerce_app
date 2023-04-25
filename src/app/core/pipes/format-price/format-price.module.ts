import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { FormatPricePipe } from "./format-price.pipe";

@NgModule({
  declarations: [FormatPricePipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [FormatPricePipe]
})

export class FormatPriceModule {}
