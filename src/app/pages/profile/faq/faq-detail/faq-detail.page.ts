import { FAQ } from './../../../../core/models/faq/faq.model';
import { FaqService } from './../../../../core/services/faq/faq.service';
import { FAQCategory } from './../../../../core/models/faq/faq-category/faq-category.model';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-faq-detail',
  templateUrl: './faq-detail.page.html',
  styleUrls: ['./faq-detail.page.scss'],
})
export class FaqDetailPage implements OnInit, OnDestroy {

  faqCategorySelected: FAQCategory;
  faqCollection: FAQ[] = [];
  faqCollectionFiltered: FAQ[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private faqService: FaqService) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.faqCategorySelected = this.router.getCurrentNavigation().extras.state.faqCategorySelected;
      this.getFAQByCategory();
    }
  }


  ngOnInit() {
  }

  getFAQByCategory() {
    this.subscription.add(this.faqService.getAllByCategory(this.faqCategorySelected.uuid).subscribe(response => {
      this.faqCollection = response;
      this.faqCollectionFiltered = this.faqCollection;
    }));
  }

  searchFAQ(event) {
    const value: string = event.target.value;
    this.faqCollectionFiltered = this.faqCollection;

    if (value.length >= 3) {
      this.faqCollectionFiltered = this.faqCollectionFiltered.filter(
        option => {
          if (option.content.toLowerCase().includes(value.toLowerCase()) ||
            option.topic.toLowerCase().includes(value.toLowerCase())) {
            return option;
          }
        }
      );
      // Filtra si hay tags que coinciden con la búsqueda
      this.faqCollection.forEach(faq => {
        faq.tag.forEach(item => {
          if (item.name.toLowerCase().includes(value.toLowerCase())) {
            if (!this.faqCollectionFiltered.includes(faq)) {
              this.faqCollectionFiltered.push(faq);
            }
          }
        });
      });
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
