import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Router } from '@angular/router';

/**
* Defines the component responsible to manage the confirmation page.
*/
@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit {
  orderNumber: string;
  customerName: string;
  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit() {
    if (this.orderService.lastOrder) {
      this.customerName = this.orderService.lastOrder.firstName + ' ' + this.orderService.lastOrder.lastName;
      this.orderNumber = ('000000000' + this.orderService.lastOrder.id).substr(-6); // Pad to get desired format such as 000001
    } else {
      this.router.navigateByUrl('/panier'); // Redirect
    }
  }
}
