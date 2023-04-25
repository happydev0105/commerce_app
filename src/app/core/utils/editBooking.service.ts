import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EditBooking {
    public editBookingConfirm: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public modalOppened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
