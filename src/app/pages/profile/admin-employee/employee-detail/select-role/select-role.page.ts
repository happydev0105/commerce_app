import { OnDestroy } from '@angular/core';
/* eslint-disable guard-for-in */
import { EmployeeService } from 'src/app/core/services/employee/employee.service';
import { EmployeeRole } from './../../../../../core/models/enums/role.enum';
import { Employee } from './../../../../../core/models/employee/employee.model';
import { Router, NavigationExtras } from '@angular/router';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Permission } from 'src/app/core/models/permission/permission.model';
import { AlertController, IonCheckbox, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.page.html',
  styleUrls: ['./select-role.page.scss'],
})
export class SelectRolePage implements OnInit, OnDestroy {

  @ViewChild('checkBox') checkBox: IonCheckbox;

  employee: Employee;
  selectedRole = { name: 'Empleado', value: 'empleado' };
  roleForm: FormGroup;
  isWizard = false;
  isProfile = false;
  permissionCollection: Permission[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private alertController: AlertController,
    private navCtrl: NavController) {
    this.initForms();
    if (this.router.getCurrentNavigation().extras.state) {
      if (this.router.getCurrentNavigation().extras.state.employee) {
        this.employee = this.router.getCurrentNavigation().extras.state.employee;
        if (this.employee.role === EmployeeRole.PERSONALIZADO) {
          this.setPersonalizedPermissions();
        }
      }
      if (this.router.getCurrentNavigation().extras.state.isWizard) {
        this.isWizard = true;
      }
      if (this.router.getCurrentNavigation().extras.state.isProfile) {
        this.isProfile = true;
      }
      if (this.router.getCurrentNavigation().extras.state.selectedRole) {
        this.selectedRole = this.router.getCurrentNavigation().extras.state.selectedRole;
      }
    }
    this.getAllPermissions();
  }


  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ngOnInit() { }

  getAllPermissions() {
    if (sessionStorage.getItem('permission')) {
      this.permissionCollection = JSON.parse(sessionStorage.getItem('permission'));
    } else {
      this.subscription.add(this.employeeService.getAllPermissions().subscribe(response => {
        this.permissionCollection = response;
        this.permissionCollection.map(permission => {
          if (permission.name != 'gestion_empleados' &&
            permission.name != 'reseñas' &&
            permission.name != 'estadisticas' &&
            permission.name != 'configuracion' &&
            permission.name != 'sms') {
            permission.roles = ['empleado_basico', 'empleado', 'recepcionista', 'gerente'];
          } else {
            permission.roles = ['recepcionista', 'gerente'];
          }
        });
        sessionStorage.setItem('permission', JSON.stringify(this.permissionCollection));
      }));
    }
    this.permissionCollection.sort((a, b) => a.description < b.description ? -1 : 1);
  }

  initForms() {
    this.roleForm = this.formBuilder.group({
      agenda: [false],
      gestion_clientes: [false],
      ventas: [false],
      marketing: [false],
      reseñas: [false],
      formacion: [false],
      soporte: [false],
      faq: [false],
      sms: [false],
      rgpd: [false],
      gestion_empleados: [false],
      estadisticas: [false],
      configuracion: [false]
    });
  }

  setPersonalizedPermissions() {
    if (this.employee.permissions.length > 0) {
      this.employee.permissions.forEach(permission => {
        this.roleForm.get(permission.name).setValue(true);
      });
    }
  }

  showRoleInfo(event, value: string) {
    this.setRole(value);
  }

  onChangePermission(event) {
    const role = event.detail.value;
    this.setRole(role);
  }

  selectRadio(name: string, value: string) {
    this.setRole(value);
    this.selectedRole = { name, value };
  }

  setRole(role: string) {
    switch (role) {
      case 'empleado_basico':
        this.selectedRole = { name: 'Empleado básico', value: EmployeeRole.EMPLEADO_BASICO };
        if (this.employee) { this.employee.role = EmployeeRole.EMPLEADO_BASICO; }
        break;
      case 'empleado':
        this.selectedRole = { name: 'Empleado', value: EmployeeRole.EMPLEADO };
        if (this.employee) { this.employee.role = EmployeeRole.EMPLEADO; }
        break;
      case 'recepcionista':
        this.selectedRole = { name: 'Recepcionista', value: EmployeeRole.RECEPCIONISTA };
        if (this.employee) { this.employee.role = EmployeeRole.RECEPCIONISTA; }
        break;
      case 'gerente':
        this.selectedRole = { name: 'Gerente', value: EmployeeRole.GERENTE };
        if (this.employee) { this.employee.role = EmployeeRole.GERENTE; }
        break;
      case 'personalizado':
        this.selectedRole = { name: 'Personalizado', value: EmployeeRole.PERSONALIZADO };
        if (this.employee) { this.employee.role = EmployeeRole.PERSONALIZADO; }
        break;
    }
  }

  goBack() {
    const tempPermission = [];
    if (this.selectedRole.value === EmployeeRole.PERSONALIZADO) {
      for (const field in this.roleForm.controls) {
        const control = this.roleForm.get(field);
        if (control.value) {
          tempPermission.push(this.permissionCollection.filter(item => item.name === field));
        }
      }
    } else {
      this.permissionCollection.forEach(permission => {
        if (permission.roles.includes(this.selectedRole.value)) {
          tempPermission.push(permission);
        }
      });
    }
    const navigationExtras: NavigationExtras = { state: null };
    localStorage.setItem('selectedRole', JSON.stringify(this.selectedRole));
    localStorage.setItem('selectedPermission', JSON.stringify(tempPermission.flat()));
    if (tempPermission.length === 0) {
      this.showNoPermissionsSelected();
    } else {
      if (this.isWizard) {
        this.navCtrl.navigateBack(['wizard/employee/employee-item'], navigationExtras);
      } else if (this.isProfile) {
        this.navCtrl.navigateBack(['tabs/profile/edit-my-profile'], navigationExtras);
      } else {
        this.navCtrl.navigateBack(['tabs/profile/commerce-info/admin-employee/employee-detail'], navigationExtras);
      }
    }
  }

  async showNoPermissionsSelected() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'No has elegido ningún permiso. Por favor selecciona uno antes de continuar',
      buttons: ['Aceptar'],
      backdropDismiss: false
    });
    await alert.present();
  }

  selectAllPermissions(event) {
    for (const field in this.roleForm.controls) {
      const control = this.roleForm.get(field);
      control.setValue(!event.target.checked);
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
