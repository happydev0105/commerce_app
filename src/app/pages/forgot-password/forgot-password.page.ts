import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  forgotPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private authService: AuthService,
    private navCtrl: NavController) { }

  get email() {
    return this.forgotPasswordForm.get('currentEmail').value;
  }

 

  @HostListener('touchmove', ['$event'])
  onTouchMove(){
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      currentEmail: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
  }

  resetPassword() {
  
     this.authService.resetPassword(this.email).subscribe(async response => {
      console.log(response);
      
      if (response && response.status === 200) {
        this.toastService.presentToast(response.message, true);
        this.navCtrl.navigateBack(['/login']);
      }
    }); 
    this.toastService.presentToast('Te hemos enviado un correo electronico para que cambies tu contraseña', true);
    this.forgotPasswordForm.reset();
    setTimeout(() => {
      this.navCtrl.navigateBack(['/login']);
    }, 3000);
  }

}
