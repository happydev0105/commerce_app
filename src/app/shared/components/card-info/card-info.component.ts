import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { duration } from 'html2canvas/dist/types/css/property-descriptors/duration';
import { Booking } from 'src/app/core/models/reservation.model';
import { DateService } from 'src/app/core/utils/date.service';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardInfoComponent implements OnInit, OnChanges {
  @Input() reservation: Booking;
  @Input() isDragging: boolean;
  @Input() draggingData: { uuid: string; time: string };
  @Input() resizeItem: Booking;
  public oneLine: number;
  public draggingDataPrivate: { uuid: string; time: string };
  constructor(public dateService: DateService, private cd: ChangeDetectorRef) { }

  ngOnInit() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.draggingDataPrivate = changes?.draggingData?.currentValue;


    this.cd.detectChanges();
  }

  setUpOneline(reservation: Booking): number {
    const totalCharacters = 19;

    if (reservation?.customer.isWalkingClient) {
      return totalCharacters - 'Sin cita '.length;
    } else {
      return totalCharacters - (reservation?.customer?.name.length + reservation?.customer?.lastname.length);
    }

  }
}
