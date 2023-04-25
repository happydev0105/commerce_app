import { ItemReorderEventDetail, NavController } from '@ionic/angular';
import { EmployeeService } from './../../../core/services/employee/employee.service';
import { Component, OnDestroy } from '@angular/core';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-employee',
  templateUrl: './admin-employee.page.html',
  styleUrls: ['./admin-employee.page.scss'],
})
export class AdminEmployeePage implements OnDestroy {

  employeeCollection: Employee[] = [];
  employeeCollectionFiltered: Employee[] = [];
  commerceLogged: string;
  showNoData = false;
  subscription: Subscription = new Subscription();
  constructor (
    private navCtrl: NavController,
    private employeeService: EmployeeService
  ) { this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce; }


  ionViewWillEnter() {
    this.getAllEmployees();
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
      this.employeeCollection = response.sort((a: Employee, b:Employee) => a.order < b.order ? -1 : 1);
      this.employeeCollectionFiltered = this.employeeCollection;
      if (this.employeeCollection.length === 0) {
        this.showNoData = true;
      }
    }));
  }

  searchEmployee(event) {
    const value: string = event.target.value;
    this.employeeCollectionFiltered = this.employeeCollection;

    if (value.length >= 3) {
      this.employeeCollectionFiltered = this.employeeCollectionFiltered.filter(
        employee => {
          const name = employee.name.split(" ").join("");
          const lastname = employee.surname.split(" ").join("");
          const together = name.concat(lastname);
          return together.toLowerCase().includes(value.toLowerCase());
        });
    }
  }

  presentModal() { }

  goToDetail(employee: Employee) {
    const navigationExtras: NavigationExtras = { state: { employee } };
    this.navCtrl.navigateForward(['tabs/profile/commerce-info/admin-employee/employee-detail'], navigationExtras);
  }

  goToCreate() {
    const navigationExtras: NavigationExtras = { state: { orderNumber: this.employeeCollection  } };
    this.navCtrl.navigateForward(['tabs/profile/commerce-info/admin-employee/employee-detail'],navigationExtras);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
