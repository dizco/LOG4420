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

  constructor(private shoppingCartService: ShoppingCartService) {
    this.shoppingCartService.loadItems()
      .subscribe();
  }

  get itemsCount(): number {
    return this.shoppingCartService.itemsCount;
  }
}
