import { ItemReorderEventDetail, NavController } from '@ionic/angular';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
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
export class ServicesWizardPage implements OnDestroy {
  serviceCollection: ICategoryService[] = [];
  service: IService[];
  serviceCollectionFiltered: ICategoryService[] = [];
  commerceLogged: string;
  isCategoryModalOpen = false;
  newCategory: ICategoryService;
  subscription: Subscription = new Subscription();
  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private servService: ServicesService
  ) {
    this.commerceLogged = JSON.parse(
      localStorage.getItem('currentUser')
    ).commerce;
  }


  ionViewWillEnter() {
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
    this.subscription.add(this.servService
      .findServiceCategoryByCommerce(this.commerceLogged)
      .subscribe((response: ICategoryService[]) => {
        this.serviceCollection = response.sort(
          (a: ICategoryService, b: ICategoryService) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        console.log(this.serviceCollection);

        this.serviceCollectionFiltered = this.serviceCollection;
        this.service = response.reduce(
          (acc, it) => [...acc, ...it.services.sort((a: IService, b: IService) => a.order > b.order ? 1 : -1)],
          []
        );
      }));
  }

  goToNext() {
    this.navCtrl.navigateForward(['wizard/employee']);
  }

  goToDetail(service: IService, category?: ICategoryService) {
    service.category = category;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activatedRoute,
      state: { service, isFromWizard: true },
    };
    this.navCtrl.navigateForward(['service-item'], navigationExtras);
  }

  goToCreate() {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activatedRoute,
      state: { orderNumber: this.serviceCollection },
    };
    this.navCtrl.navigateForward(['service-item'], navigationExtras);
  }

  editCategory(category: ICategoryService) {
    this.newCategory = category;
    this.isCategoryModalOpen = true;
  }

  setOpen(value: boolean) {
    this.isCategoryModalOpen = value;
  }

  deleteCategory() {
    this.subscription.add(this.servService.deleteCategoryService(this.newCategory.uuid).subscribe((res: ICategoryService) => {
      this.isCategoryModalOpen = false;
      this.getAllServices();
    }));
  }

  createNewCategory() {
    const newCategoryDto: ServiceCategoryDto = new ServiceCategoryDto();
    newCategoryDto.name = this.newCategory.name;
    newCategoryDto.uuid = this.newCategory.uuid;
    newCategoryDto.services = this.newCategory.services;
    newCategoryDto.commerce = this.commerceLogged;
    this.subscription.add(this.servService
      .updateCategoryService(newCategoryDto)
      .subscribe((res: ICategoryService) => {
        this.isCategoryModalOpen = false;
      }));
    this.isCategoryModalOpen = false;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
