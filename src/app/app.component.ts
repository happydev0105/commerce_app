import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from './core/models/employee/employee.model';
import { PushService } from './core/services/push/push.service';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { StatusBar, Style } from '@capacitor/status-bar';
import { environment } from 'src/environments/environment';
import { SplashScreenDirective } from './splash-screen.directive';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(SplashScreenDirective, { static: false }) splashScreen: SplashScreenDirective;
  public spinnerComponent = SpinnerComponent;
  constructor(
    private push: PushService,
    private utils: UtilsService,
    private platform: Platform,
    private screenOrientation: ScreenOrientation) {

    const setStatusBarStyleDark = async () => {
      await StatusBar.setStyle({ style: Style.Light });
    };
    const setOverlaysWebView = async () => {
      await StatusBar.setOverlaysWebView({ overlay: false });
    };

    setStatusBarStyleDark();
    setOverlaysWebView();

    const currentUser: Employee = JSON.parse(localStorage.getItem('currentUser'));
    this.utils.getCommerceData(currentUser?.commerce);


  //  this.push.oneSignalInit();


   // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.splashScreen.nativeElement.remove();
    }, 3000); // Adjust the time as needed
  }
  
}
