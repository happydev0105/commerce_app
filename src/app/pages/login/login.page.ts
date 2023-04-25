import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { PushService } from 'src/app/core/services/push/push.service';
import { NavController, Platform } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { PushRelationService } from 'src/app/core/services/push-relation/push-relation.service';
import { CreatePushRelation } from 'src/app/core/models/push-relation.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],

})
export class LoginPage implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isSubmitted = false;
  password = true;
  isLoggedin: boolean;
  showAppleSignIn: boolean;
  subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private pushService: PushService,
    private pushRelationService: PushRelationService,
    private platform: Platform,
    private utilService: UtilsService
  ) { }

  get emailField() {
    return this.loginForm.get('email').value;
  }

  get passwordField() {
    return this.loginForm.get('password').value;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onScroll($event) {
    Keyboard.hide();
  }

  loginWithEmail() {
    this.isSubmitted = true;
    this.subscription.add(
      this.authService.loginWithEmail({ email: this.emailField.toLowerCase(), password: this.passwordField }).subscribe(result => {
        const user = result.user;
        this.utilService.getCommerceData(user.commerce);

       // this.pushService.setExternalID(user.uuid);
        const pushRelation: CreatePushRelation = new CreatePushRelation();
        pushRelation.oneSignal = localStorage.getItem('osp');
        pushRelation.user = user.uuid;
        this.subscription.add(this.pushRelationService.saveRelation(pushRelation).subscribe(res => {
          console.log({ res });
        }));
        localStorage.setItem('currentUser', JSON.stringify(user));
        const permissionCollection = user.permissions;
        permissionCollection.map(permission => {
          if (permission.name !== 'gestion_empleados' &&
            permission.name !== 'reseñas' &&
            permission.name !== 'estadisticas' &&
            permission.name !== 'configuracion') {
            permission.roles = ['empleado_basico', 'empleado', 'recepcionista', 'gerente'];
          } else {
            permission.roles = ['recepcionista', 'gerente'];
          }
        });
        sessionStorage.setItem('permission', JSON.stringify(permissionCollection));
        this.navCtrl.navigateForward(['/tabs/home'], { state: { user } });
      }));
  }
  tooglePassword() {
    this.password = !this.password;
  }

  goToRegister() {
    //this.navCtrl.navigateForward(['/register']);
    window.open(environment.registerWeb, '_blank'); // Página de registro en Wordpress
  }

  goToForgotPassword() {
    this.navCtrl.navigateForward(['/forgot-password']);
  }


  submitForm() {
    this.loginWithEmail();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
