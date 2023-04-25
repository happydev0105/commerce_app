import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RGPD } from 'src/app/core/models/rgpd/rgpd.model';
import { RgpdService } from 'src/app/core/services/rgpd/rgpd.service';

@Component({
  selector: 'app-rgpd',
  templateUrl: './rgpd.page.html',
  styleUrls: ['./rgpd.page.scss'],
})
export class RgpdPage implements OnInit, OnDestroy {

  rgpdCollection: RGPD[] = [];
  rgpdCollectionFiltered: RGPD[] = [];

  subscription: Subscription = new Subscription();

  constructor(private rgpdService: RgpdService) { }


  ngOnInit() {
    this.getAllRGPD();
  }

  getAllRGPD() {
    this.subscription.add(this.rgpdService.getAllRGPD().subscribe(result => {
      this.rgpdCollection = result;
      this.rgpdCollectionFiltered = this.rgpdCollection;
    }));
  }

  searchRGPD(event) {
    const value: string = event.target.value;
    this.rgpdCollectionFiltered = this.rgpdCollection;

    if (value.length >= 3) {
      this.rgpdCollectionFiltered = this.rgpdCollectionFiltered.filter(
        product => product.title.toLowerCase().includes(value.toLowerCase()));
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
