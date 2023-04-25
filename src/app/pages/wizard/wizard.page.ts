import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/core/models/employee/employee.model';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.page.html',
  styleUrls: ['./wizard.page.scss'],
})
export class WizardPage implements OnInit {

  username: string;

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getUserName();
  }

  goToNext() {
    this.navCtrl.navigateForward(['timetable'], { relativeTo: this.activatedRoute });
  }

  getUserName() {
    const currentUser: Employee = JSON.parse(localStorage.getItem('currentUser'));
    this.username = `${currentUser.name} ${currentUser.surname}`;
  }
}
