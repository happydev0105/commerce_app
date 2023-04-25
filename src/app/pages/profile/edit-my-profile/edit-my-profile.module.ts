import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMyProfilePageRoutingModule } from './edit-my-profile-routing.module';

import { EditMyProfilePage } from './edit-my-profile.page';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';
import { FormatPriceModule } from 'src/app/core/pipes/format-price/format-price.module';
import { GetImageModule } from 'src/app/core/pipes/get-image/get-image.module';
import { TranslateDaysModule } from 'src/app/core/pipes/translate-days/translate-days.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditMyProfilePageRoutingModule,
    HeaderModule,
    IonIntlTelInputModule,
    TranslateDaysModule,
    FormatPriceModule,
    GetImageModule
  ],
  declarations: [EditMyProfilePage]
})
export class EditMyProfilePageModule {}
