import { NavController } from '@ionic/angular';
import { FAQCategory } from './../../../core/models/faq/faq-category/faq-category.model';
import { FaqService } from './../../../core/services/faq/faq.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit, OnDestroy {

  faqCategoriesCollection: FAQCategory[] = [];
  faqCategoriesCollectionFiltered: FAQCategory[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private navCtrl: NavController,
    private faqService: FaqService) { }


  ngOnInit() {
    this.getAllFAQCategories();
  }

  getAllFAQCategories() {
    this.subscription.add(this.faqService.getAllFAQcategories().subscribe(response => {
      this.faqCategoriesCollection = response.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      this.faqCategoriesCollectionFiltered = this.faqCategoriesCollection;
    }));
  }

  searchFAQCategory(event) {
    const value: string = event.target.value;
    this.faqCategoriesCollectionFiltered = this.faqCategoriesCollection;

    if (value.length >= 3) {
      this.faqCategoriesCollectionFiltered = this.faqCategoriesCollectionFiltered.filter(
        option => option.name.toLowerCase().includes(value.toLowerCase()));
    }
  }

  goToDetail(item: FAQCategory) {
    const navigationExtras: NavigationExtras = {
      state: { faqCategorySelected: item }
    };
    this.navCtrl.navigateForward(['tabs/profile/faq/faq-detail'], navigationExtras);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
