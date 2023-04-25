import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SmsDto } from 'src/app/core/dto/sms.dto';
import { SmsResponse } from 'src/app/core/interfaces/sms-response.interface';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { Customer } from 'src/app/core/models/customer/customer.model';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { SmsService } from 'src/app/core/services/sms/sms.service';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss'],
})
export class SmsComponent implements OnInit {

  public smsForm: FormGroup;
  commerceLogged: Commerce;
  public characterCount = 0;
  public availableCharacters = 160;
  customerCollection: Customer[] = [];
  showMessage = false;
  showMessageExceded = false;
  allRecipents = false;
  toSent = 0;
  public availableSMS = 0;
  public fromCustomerPhone: string;
 isFromCustomer = false;
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private navCtrl: NavController,
    private smsService: SmsService,
    private route: ActivatedRoute) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentCommerce'));
    this.availableSMS = this.commerceLogged.smsAvailable - this.commerceLogged.smsSent;
    if (this.route.snapshot.queryParams.phone) {
      this.fromCustomerPhone = this.route.snapshot.queryParams.phone;
      this.isFromCustomer = true;
    }
  }
  get recipents() {
    return this.smsForm.get('recipents');
  }


  get message() {
    return this.smsForm.get('message');
  }


  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }


  ngOnInit() {
    this.getAllCustomerByCommerceAndCreatedBy();
  }

  onChangeCheckbox(event) {


    event.preventDefault();
    this.allRecipents = event.detail.checked;
    if (this.allRecipents) {
      this.recipents.setValue(this.customerCollection.map((customer: Customer) => customer.phone));
      this.toSent = this.customerCollection.length;
    } else {
      this.recipents.setValue(null);
      this.toSent = this.smsForm.get('recipents').value.length;
    }
    if (this.toSent > this.availableSMS) {
      this.showMessageExceded = true;
    } else {
      this.showMessageExceded = false;

    }
  }
  calculateRecip(event) {
    this.toSent = event.detail.value.length;
    if (this.toSent > this.availableSMS) {
      this.showMessageExceded = true;
    } else {
      this.showMessageExceded = false;
    }
  }
  countCharacter() {
    if (this.message.value.length > this.availableCharacters) {
      this.message.value.slice(0, this.availableCharacters);
    }
    this.characterCount = this.message.value.length;
    const specialCharCount = this.message.value.split('').reduce((count, char) => {
      if (/[^\w\s]/.test(char)) {
        count += 1;
      }
      return count;
    }, 0);
    this.characterCount = this.message.value.length + specialCharCount;
    this.availableCharacters = 160 - specialCharCount;
    if (this.characterCount > 160) {
      this.showMessage = true;
    } else {
      this.showMessage = false;
    }
  }

  initForm(): void {
    this.smsForm = this.fb.group({
      recipents: [this.fromCustomerPhone ?
        this.customerCollection.map((customer: Customer) => {
          if (customer.phone === this.fromCustomerPhone.replace(/"/g, '')) { return customer.phone; }
        }) :
        '', [Validators.required,]],
      message: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(160)]]
    });
  }

  sendSms(): void {
    const dto = this.mapSms();
    this.smsService.sendSms(this.commerceLogged.uuid, dto).subscribe((res: SmsResponse) => {
      this.navCtrl.navigateForward(['sms-confirmation']);
    });
  }

  navigateToCustomer(){
    this.navCtrl.back();
  }

  mapSms(): SmsDto {
    const newSms: SmsDto = new SmsDto();
    newSms.commerce = this.commerceLogged;
    newSms.destination = this.recipents.value.filter((item => item !== undefined));
    newSms.message = this.message.value;
    return newSms;
  }

  getAllCustomerByCommerceAndCreatedBy() {
    this.customerService.getAllCustomerByCommerceAndCreatedBy(this.commerceLogged.uuid).subscribe((res: Customer[]) => {
      if (res) {
        this.customerCollection = res.filter(c => c.phone.charAt(3) === '6' || c.phone.charAt(3) === '7');
        this.initForm();
      }
    });
  }

  checkIfPhoneisMobile(phone: string): boolean {
    return false;
  }
}
