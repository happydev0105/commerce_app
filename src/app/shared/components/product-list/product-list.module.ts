import { NoDataModule } from 'src/app/shared/components/no-data/no-data.module';
import { ProductListComponent } from './product-list.component';
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';

@NgModule({
  declarations: [ProductListComponent],
  imports: [CommonModule, IonicModule, NoDataModule, FormatPriceModule],
  exports: [ProductListComponent],
})
export class ProductListModule {}
