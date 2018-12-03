import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './api-response';
import { Config } from './config';
import { catchError, map, take} from 'rxjs/operators';

export interface Order {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  products: OrderProduct[];
}

export interface OrderProduct {
  id: number;
  quantity: number;
}

const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
const options = { headers: headers, withCredentials: true };


@Injectable()
export class OrderService {
  lastOrder: Order;

  constructor(private http: HttpClient) { }

  submitOrder(order: Order): Observable<ApiResponse<{}>> {
    const url = `${Config.apiUrl}/orders`;
    return this.http.post(url, order, options)
      .pipe(
        map(() => {
          this.lastOrder = order;
          return new ApiResponse<{}>(true);
        }),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<{}>(false, null, err));
        }),
      );
  }

  getOrders(): Observable<ApiResponse<Order[]>> {
    const url = `${Config.apiUrl}/orders`;
    return this.http.get<Order[]>(url, options)
      .pipe(
        take(1),
        map(orders => new ApiResponse<Order[]>(true, orders)),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<Order[]>(false, null, err));
        }),
      );
  }
}

