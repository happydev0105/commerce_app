import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { WizardGuard } from './wizard-guard.guard';
import { AuthGuard } from './core/services/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, WizardGuard],
    loadChildren: () =>
      import('./shared/tabs/tabs.module').then((m) => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'payment-confirmation',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/payments/payment-confirmation/payment-confirmation.module')
      .then(m => m.PaymentConfirmationPageModule)
  },
  {
    path: 'sms-confirmation',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/sms/sms-confirmation/sms-confirmation.module')
      .then(m => m.SmsConfirmationPageModule)
  },
  {
    path: 'wizard',
    loadChildren: () => import('./pages/wizard/wizard.module').then(m => m.WizardPageModule)
  },
  {
    path: '**', redirectTo: ''
  },
  {
    path: 'location',
    loadChildren: () => import('./pages/profile/commerce-info/location/location.module').then( m => m.LocationPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
