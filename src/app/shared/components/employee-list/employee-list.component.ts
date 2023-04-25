import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { EmployeeService } from 'src/app/core/services/employee/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {

  employeeCollection: Employee[] = [];
  employeeCollectionFiltered: Employee[] = [];
  selectedEmployeeCompo: Employee[];
  commerceLogged: string;
  subscription: Subscription = new Subscription();

  constructor(
    private employeeService: EmployeeService,
    private modalCtrl: ModalController) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
  }


  ngOnInit() {
    this.getAllemployee();
  }

  getAllemployee() {
    this.subscription.add(this.employeeService
      .findEmployees(this.commerceLogged)
      .subscribe((res: Employee[]) => {
        if (res && res.length > 0) {
          this.employeeCollection = res.filter(item => item.services && item.services.length > 0);
          this.employeeCollectionFiltered = this.employeeCollection;
        }
      }));
  }
  selectEmployee(item: Employee) {
    if (!this.selectedEmployeeCompo.some((itemEmp: Employee) => itemEmp.uuid === item.uuid)) {
      this.selectedEmployeeCompo.push(item);
    } else {
      this.selectedEmployeeCompo = this.selectedEmployeeCompo.filter((itemEmp: Employee) => itemEmp.uuid !== item.uuid);
    }
  }
  searchEmployee(event) {
    const value: string = event.target.value;
    this.employeeCollectionFiltered = this.employeeCollection;

    if (value.length >= 3) {
      this.employeeCollectionFiltered = this.employeeCollectionFiltered.filter(
        (customer) => customer.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      employee: this.selectedEmployeeCompo
    });
  }

  checkIfSelected(employee: Employee): boolean {
    return this.selectedEmployeeCompo.some((emp: Employee) => emp.uuid === employee.uuid);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
