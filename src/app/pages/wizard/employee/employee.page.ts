import { ItemReorderEventDetail, NavController } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
import { NavigationExtras, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ServicesService } from 'src/app/core/services/services/services.service';
import { Service } from 'src/app/core/models/service.model';
import { IService } from 'src/app/core/interfaces/services.interface';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit, OnDestroy {
  employeeCollection: Employee[] = [];
  employeeCollectionFiltered: Employee[] = [];
  serviceCollection: Service[] = [];
  commerceLogged: string;
  subscription: Subscription = new Subscription();
  owner: Employee;
  constructor(
    private navCtrl: NavController,
    private employeeService: EmployeeService,
    private servicesService: ServicesService) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
  }

  ionViewWillEnter() {
    this.getAllEmployees();



  }

  ngOnInit(): void {

  }

  handleReorder(
    ev: CustomEvent<ItemReorderEventDetail>,
    array: Employee[]
  ) {
    const arr = ev.detail.complete(array);
    this.updateEmployeeOrder(arr);
  }

  updateEmployeeOrder(service: Employee[]): void {
    this.subscription.add(this.employeeService
      .updateOrder(service)
      .subscribe((res: any) => console.log(res)));
  }

  getAllEmployees() {
    this.subscription.add(this.employeeService.findEmployeesWithinactives(this.commerceLogged).subscribe(response => {
      response.map(employee => delete employee.booking);
      this.employeeCollection = response.sort((a: Employee, b: Employee) => a.order < b.order ? -1 : 1);
      this.employeeCollectionFiltered = this.employeeCollection;
      this.owner = this.employeeCollection.find(employee => employee.isOwner);
    }));

  }

  getAllServices(): Observable<IService[]> {
    return this.servicesService.findServiceByCommerce(this.commerceLogged);
  }

  goToNext() {
    if (this.owner.isEmployee && this.owner.services.length < 1) {
      this.subscription.add(this.getAllServices().subscribe(response => {
        if (this.owner) {
          this.owner.services = response;
          this.updateOwner(this.owner);
        }
      }));
    } else {
      this.navCtrl.navigateForward(['wizard/ready']);
    }
  }

  updateOwner(owner: Employee) {
    this.subscription.add(this.employeeService.updateEmployee(owner).subscribe(response => {
      if (response) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
          localStorage.setItem('currentUser', JSON.stringify(owner));
        }
        this.navCtrl.navigateForward(['wizard/ready']);
      }
    }));
  }

  goToDetail(employee: Employee) {
    const navigationExtras: NavigationExtras = { state: { employee } };
    this.navCtrl.navigateForward(['wizard/employee/employee-item'], navigationExtras);
  }

  goToCreateEmployee() {
    const navigationExtras: NavigationExtras = { state: { orderNumber: this.employeeCollection } };
    this.navCtrl.navigateForward(['wizard/employee/employee-item'], navigationExtras);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
