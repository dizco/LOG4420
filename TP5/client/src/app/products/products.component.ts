import { Component } from '@angular/core';
import { ProductsCategories, Product, ProductsService, ProductsSortingCriteria } from '../products.service';

/**
 * Defines the component responsible to manage the display of the products page.
 */
@Component({
  selector: 'products',
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  productsSortingCriteria = ProductsSortingCriteria; //See https://stackoverflow.com/questions/44045311/cannot-approach-typescript-enum-within-html
  productsCategories = ProductsCategories;

  sortingCriteria: string = ProductsSortingCriteria.PriceLowHigh;
  category: string = ProductsCategories.All;

  products: Product[] = [];

  constructor(private productsService: ProductsService) {
    this.refreshProducts();
  }

  sortByCriteria(sortingCriteria: ProductsSortingCriteria): void {
    this.sortingCriteria = sortingCriteria;
    this.refreshProducts();
  }

  filterByCategory(category: ProductsCategories): void {
    this.category = category;
    this.refreshProducts();
  }

  private refreshProducts(): void {
    this.productsService.getProducts(this.sortingCriteria, this.category)
      .subscribe(response => {
        if (response.success) {
          this.products = response.data;
        }
      });
  }
}
