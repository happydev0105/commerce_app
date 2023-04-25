import { INonAvailability } from '../../interfaces/non-availability.interface';

export class HolidayRange {
    groupBy: string;
    first: INonAvailability;
    last: INonAvailability;
    range: INonAvailability[];
}