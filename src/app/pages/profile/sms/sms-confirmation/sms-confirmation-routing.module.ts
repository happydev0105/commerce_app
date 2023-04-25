import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SmsConfirmationPage } from './sms-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: SmsConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmsConfirmationPageRoutingModule {}
