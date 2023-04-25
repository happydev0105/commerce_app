import { NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private navCtrl: NavController) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const idToken = localStorage.getItem('id_token');
    const currentUser = localStorage.getItem('currentUser');
    let isAuth = idToken && currentUser;
    if (!isAuth) {
      this.navCtrl.navigateRoot(['/login']);
      return false;
    } else {
      return true;
    }
  }

}
