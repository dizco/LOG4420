import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductsService } from '../products.service';
import { ShoppingCartService } from '../shopping-cart.service';

/**
 * Defines the component responsible to manage the product page.
 */
@Component({
  selector: 'product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  product: Product;
  displayDialog = false;
  dialogTimeout: number;
  itemQuantity = 1;

  /**
   * Initializes a new instance of the ProductComponent class.
   *
   * @param route                   The active route.
   * @param router
   * @param productsService
   * @param shoppingCartService
   */
  constructor(private route: ActivatedRoute, private router: Router,
    private productsService: ProductsService, private shoppingCartService: ShoppingCartService) { }

  /**
   * Occurs when the component is initialized.
   */
  ngOnInit() {
    const productId = parseInt(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.productsService.getProduct(productId)
        .subscribe(response => {
          if (response.success) {
            this.product = response.data;
          }
          else {
            this.router.navigateByUrl('/404', { skipLocationChange: true }); // Display 404 page while leaving url intact
          }
        });
    }
  }

  onSubmit(): void {
    this.addToCart(this.itemQuantity);
  }

  private addToCart(quantity: number): void {
    // TODO: Call a PUT here if the item already is in the shopping cart
    this.shoppingCartService.addItem({ product: this.product, quantity: quantity })
      .subscribe(response => {
        if (response.success) {
          clearTimeout(this.dialogTimeout);
          this.displayDialog = true;
          this.dialogTimeout = window.setTimeout(() => {
            this.displayDialog = false;
          }, 5000);
        }
      });
  }
}
