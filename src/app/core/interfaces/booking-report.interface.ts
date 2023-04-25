import { Booking } from "../models/reservation.model";

export interface BookingReport {
  finished: number,
  non_attendant: number
  payment_pending: Booking[];
  pending: number
  total: number
}
