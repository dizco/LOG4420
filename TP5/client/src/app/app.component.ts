import { Component } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';

/**
 * Defines the main component of the application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  readonly authors = [
    'Félix Boulet',
    'Gabriel Bourgault'
  ];

  itemsCount = 0;

  constructor(private shoppingCartService: ShoppingCartService) {
    this.shoppingCartService.getItemsCount()
      .subscribe(response => {
        if (response.success) {
          this.itemsCount = response.data;
        }
      });
  }
}
