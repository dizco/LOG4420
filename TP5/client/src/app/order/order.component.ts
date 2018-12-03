import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService, ShoppingCartItem } from '../shopping-cart.service';
import { OrderService, Order, OrderProduct } from '../order.service';
declare const $: any;

/**
 * Defines the component responsible to manage the order page.
 */
@Component({
  selector: 'order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  orderForm: any;
  formFirstName: string;
  formLastName: string;
  formEmail: string;
  formPhone: string;

  constructor(private shoppingCartService: ShoppingCartService, private orderService: OrderService, private router: Router) { }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    // Initializes the validation of the form. This is the ONLY place where jQuery usage is allowed.
    this.orderForm = $('#order-form');
    $.validator.addMethod('ccexp', function (value) {
      if (!value) {
        return false;
      }
      const regEx = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[1-9][0-9])$/g;
      return regEx.test(value);
    }, 'La date d\'expiration de votre carte de crédit est invalide.');
    this.orderForm.validate({
      rules: {
        'phone': {
          required: true,
          phoneUS: true
        },
        'credit-card': {
          required: true,
          creditcard: true
        },
        'credit-card-expiry': {
          ccexp: true
        }
      }
    });
  }

  /**
   * Submits the order form.
   */
  submit() {
    if (!this.orderForm.valid()) {
      return;
    }
    // TODO: Compléter la soumission des informations lorsque le formulaire soumis est valide.
    let count = 0;
    this.orderService.getOrders().subscribe(response => {
      if (response.success) {
        count = response.data.length;
        const order: Order = {
          id: count + 1,
          firstName: this.formFirstName,
          lastName: this.formLastName,
          email: this.formEmail,
          phone: this.formPhone,
          products: this.shoppingCartService.items.map((product: ShoppingCartItem) => {
            const orderProduct: OrderProduct = { id: product.product.id, quantity: product.quantity };
            return orderProduct;
          })
        };
        this.orderService.submitOrder(order)
          .subscribe(postResponse => {
            if (postResponse.success) {
              this.shoppingCartService.emptyCart().subscribe();
              this.router.navigateByUrl('/confirmation');
            }
          });
      }
    });
  }
}
