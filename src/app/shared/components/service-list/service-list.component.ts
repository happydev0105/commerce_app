import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IonCheckbox, ModalController, NavParams } from '@ionic/angular';
import { Service } from 'src/app/core/models/service.model';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent implements OnInit {
  @ViewChild('checkBox') checkBox: IonCheckbox;

  serviceCollection: Service[] = [];
  serviceCollectionFiltered: Service[] = [];
  isConfigScreen = false;
  selectedServices: Service[] = [];
  commerceLogged: string;
  showPrice = true;
  noclick=false;
  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private cdr: ChangeDetectorRef) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
    const servicesAlreadySelected = this.navParams.get('servicesSelected');
    this.showPrice = this.navParams.get('showPrice');

    if (servicesAlreadySelected && servicesAlreadySelected.length > 0) {
      this.selectedServices = servicesAlreadySelected;
      //  this.isChecked();
    }
  }

 
  @HostListener('touchmove', ['$event'])
  onTouchMove(){
    const selection = window.getSelection();
    selection.removeAllRanges();
  }


  ngOnInit() { }

  selectService(service: Service) {
    if (this.isConfigScreen) {
      if (this.selectedServices.some((item: Service) => item?.uuid === service?.uuid)) {
        this.selectedServices = this.selectedServices.filter((serv: Service) => serv.uuid !== service.uuid);
      } else {
        this.selectedServices.push(service);
      }
    } else {
      this.selectedServices.push(service);
    }
    this.isChecked();
    this.cdr.detectChanges();
    if (!this.isConfigScreen) {
      this.dismiss(true);
    }
  }

  isChecked() {
    return this.selectedServices.length === this.serviceCollectionFiltered.length;
  }

  searchService(event) {
    const value: string = event.target.value;
    this.serviceCollectionFiltered = this.serviceCollection;

    if (value.length >= 3) {
      this.serviceCollectionFiltered = this.serviceCollectionFiltered.filter(
        (service) => service.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  setSelectedClass(selectedService: Service): string {
    let classToApply = '';
    const findProduct = this.selectedServices.find(item => item.uuid === selectedService.uuid);
    if (findProduct && this.isConfigScreen) {
      classToApply = 'selectedCard';
    }
    return classToApply;
  }

  dismiss(withService: boolean) {
    if (withService) {
      this.modalCtrl.dismiss({ service: this.selectedServices })
    } else {
      this.modalCtrl.dismiss();
    }
  }

  selectAllServices() {
    if (this.selectedServices.length === this.serviceCollectionFiltered.length) {
      this.selectedServices = [];
    } else {
      this.selectedServices = [...this.serviceCollectionFiltered];
      this.checkBox.checked = true;
      if (!this.isConfigScreen) {
        this.dismiss(true);
      }
    }
  }
}
