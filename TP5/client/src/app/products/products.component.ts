import { Component } from '@angular/core';
import { Product, ProductsService } from '../products.service';

/**
 * Defines the component responsible to manage the display of the products page.
 */
@Component({
  selector: 'products',
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  products: Product[] = [];

  constructor(private productsService: ProductsService) {
    this.productsService.getProducts().then(products => this.products = products);
  }
  // TODO: À compléter
}
