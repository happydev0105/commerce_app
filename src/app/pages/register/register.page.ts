import { NavController } from '@ionic/angular';
import { CustomerDto } from '../../core/models/customer/customer.dto.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { formatISO } from 'date-fns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {

  registerForm: FormGroup;
  subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController
  ) {}


  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  registerCustomer() {
    const newCustomer = this.createNewCustomerModel();
    this.subscription.add(this.authService.registerNewUser(newCustomer).subscribe((customer) => {
      this.navCtrl.navigateBack(['/tabs/home'], { state: { user: customer } });
    }));
  }

  createNewCustomerModel(): CustomerDto {
    const customerDto: CustomerDto = new CustomerDto();
    customerDto.name = this.registerForm.get('name').value;
    customerDto.email = this.registerForm.get('email').value;
    customerDto.password = this.registerForm.get('password').value;
    customerDto.createdAt = formatISO(new Date());
    return customerDto;
  }

  goToLogin() {
    this.navCtrl.navigateRoot(['/login']);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
