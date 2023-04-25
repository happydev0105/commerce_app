import { Injectable } from '@angular/core';
import OneSignal from 'onesignal-cordova-plugin';
import { Employee } from '../../models/employee/employee.model';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  currentUser: Employee = JSON.parse(localStorage.getItem('currentUser'));
  constructor() { }

  oneSignalInit() {

    OneSignal.setAppId('4b8eab41-a910-4a04-a847-5ce7402e3f16');

    OneSignal.getDeviceState((stateChanges) => {
      console.log(
        'OneSignal getDeviceState: ', JSON.stringify(stateChanges)
      );
      if (stateChanges && stateChanges.hasNotificationPermission) {
        localStorage.setItem('osp', stateChanges.userId);
      } else {
        console.log('Push notifications are disabled');
      }
    });
    if (this.currentUser) {
      OneSignal.setExternalUserId(this.currentUser.uuid, (results: any) => {
        // The results will contain push and email success statuses
        console.log('Results of setting external user id');
        console.log(results);

        // Push can be expected in almost every situation with a success status, but
        // as a pre-caution its good to verify it exists
        if (results.push && results.push.success) {
          console.log('Results of setting external user id push status:');
          console.log(results.push.success);
        }

      });

    }

    OneSignal.setNotificationOpenedHandler((jsonData) => {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });

    OneSignal.promptForPushNotificationsWithUserResponse((accepted) => {
      console.log('User accepted notifications: ' + accepted);
    });
  }

  setExternalID(userUuid: string) {

    OneSignal.setExternalUserId(userUuid, userUuid, (results: any) => {
      // The results will contain push and email success statuses
      console.log('Results of setting external user id');
      console.log(results);

      // Push can be expected in almost every situation with a success status, but
      // as a pre-caution its good to verify it exists
      if (results.push && results.push.success) {
        console.log('Results of setting external user id push status:');
        console.log(results.push.success);
      }

    });
  }


}
