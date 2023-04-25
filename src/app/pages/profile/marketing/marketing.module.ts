import { GetImageModule } from 'src/app/core/pipes/get-image/get-image.module';
import { StaticGalleryModule } from './../../../shared/components/static-gallery/static-gallery.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketingPageRoutingModule } from './marketing-routing.module';

import { MarketingPage } from './marketing.page';
import { ReviewListModule } from 'src/app/shared/components/review-list/review-list.module';
import { GalleryListModule } from 'src/app/shared/components/gallery-list/gallery-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketingPageRoutingModule,
    HeaderModule,
    ReviewListModule,
    GalleryListModule,
    StaticGalleryModule,
    GetImageModule
  ],
  declarations: [MarketingPage]
})
export class MarketingPageModule {}
