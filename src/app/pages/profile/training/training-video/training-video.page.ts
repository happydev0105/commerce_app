import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ITraining } from 'src/app/core/interfaces/training.interface';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-training-video',
  templateUrl: './training-video.page.html',
  styleUrls: ['./training-video.page.scss'],
  providers: [AppAvailability, InAppBrowser],
})
export class TrainingVideoPage implements OnInit {

  video: ITraining;

  constructor(private router: Router,
    private appAvailability: AppAvailability,
    private platform: Platform,
    private inAppBrowser: InAppBrowser,) {
    if (this.router.getCurrentNavigation().extras.state) { }
    this.video = this.router.getCurrentNavigation().extras.state.video;
  }

  ngOnInit() {
  }
  openInAppWebsite(url: string) {
    if (!url.startsWith('https://') || !url.startsWith('http://')) {
      url = 'http://' + url;
    }
    this.inAppBrowser.create(url, '_system');
  }
  openInstagram(name: string) {
    let app: string;
    if (this.platform.is('ios')) {
      app = 'instagram://';
    } else if (this.platform.is('android')) {
      app = 'com.instagram.android';
    } else {
      this.openInApp('https://www.instagram.com/' + name);
      return;
    }
    this.appAvailability
      .check(app)
      .then((res) => {
        this.openInApp('instagram://user?username=' + name);
      })
      .catch((err) => {
        this.openInApp('https://www.instagram.com/' + name);
      });
  }
  openInApp(url: string) {
    this.inAppBrowser.create(url, '_system');
  }


}
