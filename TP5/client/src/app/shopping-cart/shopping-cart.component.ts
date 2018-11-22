import { Component } from '@angular/core';
import { ShoppingCartItem, ShoppingCartService } from '../shopping-cart.service';
import { forkJoin } from 'rxjs';

/**
 * Defines the component responsible to manage the shopping cart page.
 */
@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent {
  items: ShoppingCartItem[] = [];

  constructor(private shoppingCartService: ShoppingCartService) {

    const obs = forkJoin(
      shoppingCartService.addItem({productId: 2, quantity: 2}),
      shoppingCartService.addItem({productId: 3, quantity: 2}),
      shoppingCartService.addItem({productId: 4, quantity: 2}),
    );
    obs.subscribe(() => {
      shoppingCartService.getItems()
        .subscribe(response => {
          if (response.success) {
            this.items = response.data;
          }
        });
    });
  }

  totalPrice(): number {
    if (this.items.length === 0) {
      return 0;
    }
    const reducer = (accumulator: number, current: number) => accumulator + current;
    return this.items.map(item => item.product.price * item.quantity).reduce(reducer);
  }

  removeItem(productId: number): void {
    this.shoppingCartService.removeItem(productId)
      .subscribe(response => {
        if (response.success) {
          this.items = this.items.filter(item => item.product.id !== productId);
        }
      });
  }

  changeQuantity(productId: number, newQuantity: number): void {
    this.shoppingCartService.updateQuantity(productId, newQuantity)
      .subscribe(response => {
        if (response.success) {
          this.items.filter(item => item.product.id === productId).map(item => item.quantity = newQuantity);
        }
      });
  }

  emptyCart(): void {
    this.shoppingCartService.emptyCart()
      .subscribe(response => {
        if (response.success) {
          this.items = [];
        }
      });
  }
}
