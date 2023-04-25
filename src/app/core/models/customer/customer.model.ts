import { Booking } from '../reservation.model';

export class Customer {
  uuid: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  birth: string;
  hasApp: boolean;
  photoURL: string;
  commerce: string;
  createdBy: string;
  isWalkingClient: boolean;
  booking?: Booking[];
  createdByCommerce: boolean;
}
