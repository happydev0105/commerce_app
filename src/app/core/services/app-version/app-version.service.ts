import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IVersionControl } from '../../interfaces/version-control/version-control.interface';
import { IVersioning } from '../../interfaces/version-control/versioning.interface';
import { VersionControlService } from '../version-control/version-control.service';
@Injectable({
  providedIn: 'root'
})
export class AppVersionService {

  constructor(private versionControlService: VersionControlService) { }

  async getThisAppVersion() {
    this.getLastVersion();
  }

  getLastVersion() {
    this.versionControlService.findVersionByType().subscribe((res: IVersionControl) => {
      const versionApp = environment.appVersion;
      const actualVersion: IVersioning = {
        mayor: +versionApp.split('.')[0],
        minor: +versionApp.split('.')[1],
        patch: +versionApp.split('.')[2],
      };
      if (this.compareVersions(actualVersion, res) && res.isMandatory) {
        localStorage.setItem('updateApp', '1');
      } else {
        localStorage.setItem('updateApp', '0');
      }
    });
  }
  compareVersions(actual: IVersioning, server: IVersionControl): boolean {
    if (server.mayor > actual.mayor || server.minor > actual.minor || server.patch > actual.patch) {
      return true;
    }
    return false;
  }
}
