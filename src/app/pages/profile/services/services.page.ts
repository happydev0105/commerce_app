import { ItemReorderEventDetail, NavController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ServiceCategoryDto } from 'src/app/core/dto/serviceCategory.dto';
import { ICategoryService } from 'src/app/core/interfaces/category-service.interface';
import { IService } from 'src/app/core/interfaces/services.interface';
import { ServicesService } from 'src/app/core/services/services/services.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit, OnDestroy {
  serviceCollection: ICategoryService[] = [];
  serviceCollectionFiltered: ICategoryService[] = [];
  commerceLogged: string;
  isCategoryModalOpen = false;
  newCategory: ICategoryService;
  totalServices = 0;
  subscription: Subscription = new Subscription();
  constructor(
    private navCtrl: NavController,
    private servService: ServicesService,
    private activatedRoute: ActivatedRoute) {
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
  }


  ngOnInit() {

  }

  ionViewWillEnter() {
    this.totalServices = 0;
    this.getAllServices();
  }

  handleReorder(
    ev: CustomEvent<ItemReorderEventDetail>,
    array: IService[]
  ) {
    const arr = ev.detail.complete(array);
    this.updateServiceOrder(arr);
  }

  updateServiceOrder(service: IService[]): void {
    this.subscription.add(this.servService
      .updateOrder(service)
      .subscribe((res: any) => console.log(res)));
  }

  getAllServices() {
    this.subscription.add(this.servService.findServiceCategoryByCommerce(this.commerceLogged).subscribe((response: ICategoryService[]) => {
      this.serviceCollection = response;
      this.serviceCollectionFiltered = this.serviceCollection;
      this.serviceCollectionFiltered.forEach(category => this.totalServices += category.services.length);
    }));
  }

  searchEmployee(event) {
    const value: string = event.target.value;
    this.serviceCollectionFiltered = this.serviceCollection;
    const x = this.serviceCollectionFiltered.reduce((acc, it) => [...acc, ...it.services], []);
    if (value.length >= 3) {
      const y = x.filter((item: IService) => {
        if (item.name.toLowerCase().includes(value.toLowerCase())) {
          return item;
        }
      });
    }
  }

  goToDetail(service: IService, category?: ICategoryService) {
    service.category = category;
    const navigationExtras: NavigationExtras = { relativeTo: this.activatedRoute, state: { service } };
    this.navCtrl.navigateForward(['service-item'], navigationExtras);
  }

  goToCreate() {
    const navigationExtras: NavigationExtras = { relativeTo: this.activatedRoute, state: { orderNumber: this.serviceCollection } };
    this.navCtrl.navigateForward(['service-item'], navigationExtras);
  }
  editCategory(category: ICategoryService) {
    this.newCategory = category;
    this.isCategoryModalOpen = true;
  }

  createNewCategory() {
    const newCategoryDto: ServiceCategoryDto = new ServiceCategoryDto();
    newCategoryDto.name = this.newCategory.name;
    newCategoryDto.uuid = this.newCategory.uuid;
    newCategoryDto.services = this.newCategory.services;
    newCategoryDto.commerce = this.commerceLogged;
    this.subscription.add(this.servService.updateCategoryService(newCategoryDto).subscribe((res: ICategoryService) => {
      this.isCategoryModalOpen = false;
      this.getAllServices();
    }));
  }
  deleteCategory() {
    this.subscription.add(this.servService.deleteCategoryService(this.newCategory.uuid).subscribe((res: ICategoryService) => {
      this.isCategoryModalOpen = false;
      this.getAllServices();
    }));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
