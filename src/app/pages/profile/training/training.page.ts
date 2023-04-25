import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ITraining } from 'src/app/core/interfaces/training.interface';
import { TrainingService } from 'src/app/core/services/training/training.service';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';

@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
})
export class TrainingPage implements OnInit, OnDestroy {

  trainingCollection: ITraining[] = [];
  currentMonth = new Date().getMonth();
  subscription: Subscription = new Subscription();
  commerceLogged: Commerce;
  constructor(
    private trainingService: TrainingService,
    private activated: ActivatedRoute,
    private navCtrl: NavController) { 
      this.commerceLogged = JSON.parse(localStorage.getItem('currentCommerce'));
    }


  ngOnInit(): void {
    this.getVideos();
  }

  getVideos() {
    this.subscription.add(this.trainingService.findVideosFromMonth(this.currentMonth).subscribe((res: ITraining[]) => {
      if (res) {
        this.trainingCollection = res.filter((item: ITraining) => 
        item.title.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() === 
        this.commerceLogged.type.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase())
        .sort((a, b) => a.monthNumber < b.monthNumber ? 1 : -1);

      }
    }));
  }



  navigateTo(video: ITraining) {
    if (video.isAvailable) {
      const navigationExtras: NavigationExtras = { relativeTo: this.activated, state: { video } };
      this.navCtrl.navigateForward(['training-video'], navigationExtras);
    }

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
