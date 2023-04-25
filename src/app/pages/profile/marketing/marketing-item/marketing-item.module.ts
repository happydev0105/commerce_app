import { GetImageModule } from './../../../../core/pipes/get-image/get-image.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketingItemPageRoutingModule } from './marketing-item-routing.module';

import { MarketingItemPage } from './marketing-item.page';
import { StarRatingModule } from 'angular-star-rating';
import { SpinnerModule } from 'src/app/shared/components/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketingItemPageRoutingModule,
    HeaderModule,
    GetImageModule,
    StarRatingModule,
    SpinnerModule
  ],
  declarations: [MarketingItemPage]
})
export class MarketingItemPageModule {}
