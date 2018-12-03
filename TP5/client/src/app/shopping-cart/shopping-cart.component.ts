import { Component, OnInit } from '@angular/core';
import { ShoppingCartItem, ShoppingCartService } from '../shopping-cart.service';

/**
 * Defines the component responsible to manage the shopping cart page.
 */
@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent implements OnInit {

  constructor(private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.shoppingCartService.loadItems()
      .subscribe();
  }

  get items(): ShoppingCartItem[] {
    return this.shoppingCartService.items; // Reference items stored in the shared service
  }

  totalPrice(): number {
    if (this.items.length === 0) {
      return 0;
    }
    const reducer = (accumulator: number, current: number) => accumulator + current;
    return this.items.map(item => item.product.price * item.quantity).reduce(reducer);
  }

  removeItem(productId: number): void {
    if (confirm('Êtes-vous certain de vouloir retirer cet item?')) {
      this.shoppingCartService.removeItem(productId)
        .subscribe();
    }
  }

  changeQuantity(productId: number, newQuantity: number): void {
    this.shoppingCartService.updateQuantity(productId, newQuantity)
      .subscribe();
  }

  emptyCart(): void {
    if (confirm('Êtes-vous certain de vouloir vider le panier?')) {
      this.shoppingCartService.emptyCart()
        .subscribe();
    }
  }
}
