import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Commerce } from './core/models/commerce/commerce.model';
import { Employee } from './core/models/employee/employee.model';
import { TimeTableService } from './core/services/timeTable/time-table.service';

@Injectable({
  providedIn: 'root'
})
export class WizardGuard implements CanActivate {
  commerce: Commerce;
  constructor(private timetableService: TimeTableService, private router: Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const loggedEmployee: Employee = JSON.parse(localStorage.getItem('currentUser'));
    return this.timetableService.findTimetableByCommerce(loggedEmployee.commerce).toPromise().then((res: Commerce) => {
      this.commerce = res;
      const wizardComplete = localStorage.getItem('wizard');
      if (this.commerce) {
        if (this.commerce.services.length > 0 || (this.commerce.timetable !== null && wizardComplete && loggedEmployee.role !== 'gerente')) {
          return true;
        }
      }
      this.router.navigate(['wizard']);
      return false;
    });


  }

}
