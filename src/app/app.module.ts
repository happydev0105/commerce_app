import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HammerModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { RequestInterceptor } from './core/interceptors/request.interceptor';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { StarRatingModule } from 'angular-star-rating';
import { AuthGuard } from './core/services/auth/auth.guard';
import { AppSettingsService } from './core/app-settings.service';
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { InitService } from './core/init.service';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SpinnerModule } from './shared/components/spinner/spinner.module';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { SplashScreenComponent } from './shared/components/splash-screen/splash-screen.component';
import { SplashScreenDirective } from './splash-screen.directive';

export const servicesOnRun = (initService: InitService) => () => initService.init();

registerLocaleData(localeEs, 'es');
@NgModule({
  declarations: [AppComponent,SplashScreenComponent, SplashScreenDirective],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ mode: 'ios' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HammerModule,
    HttpClientModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    StarRatingModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    IonIntlTelInputModule,
    SpinnerModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER, useFactory: servicesOnRun,
      multi: true,
      deps: [InitService]
    },

    AppSettingsService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-Es' },
    //{ provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    Base64ToGallery,
    ScreenOrientation,
    AuthGuard,
    StatusBar,
    SpinnerDialog,
    AppVersion],
  bootstrap: [AppComponent],
})
export class AppModule { }
