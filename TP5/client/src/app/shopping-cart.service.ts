import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { ApiResponse } from './api-response';
import { Config } from './config';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { Product } from './products.service';

export interface RawShoppingCartItem {
  productId: number;
  quantity: number;
}
export interface ShoppingCartItem {
  product: Product;
  quantity: number;
}

const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
const options = { headers: headers, withCredentials: true };


@Injectable()
export class ShoppingCartService {

  constructor(private http: HttpClient) { }

  getItems(): Observable<ApiResponse<ShoppingCartItem[]>> {
    //The logic here is complicated by the fact that the API returns only the product id but we need more information (name)
    //See https://www.learnrxjs.io/operators/combination/forkjoin.html (example 2) for summary of steps followed

    const url = `${Config.apiUrl}/shopping-cart`;
    return this.http.get<RawShoppingCartItem[]>(url, options)
      .pipe(
        take(1),
        mergeMap(items => { //Allows multiple active inner subscriptions
          return forkJoin(...items.map(item => {
            //For each individual item, produce an http request to the server
            return this.http.get<Product>(`${Config.apiUrl}/products/${item.productId}`, options)
              .pipe(
                switchMap(product => {
                  return of({ product: product, quantity: item.quantity } as ShoppingCartItem);
                })
              );
          }));
        }),
        map(items => new ApiResponse<ShoppingCartItem[]>(true, items)),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<ShoppingCartItem[]>(false, null, err));
        }),
      );
  }

  getItemsCount(): Observable<ApiResponse<number>> {
    const url = `${Config.apiUrl}/shopping-cart`;
    return this.http.get<RawShoppingCartItem[]>(url, options)
      .pipe(
        take(1),
        map(items => new ApiResponse<number>(true, items.length)),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<number>(false, null, err));
        }),
      );
  }

  addItem(item: RawShoppingCartItem): Observable<ApiResponse<{}>> {
    const url = `${Config.apiUrl}/shopping-cart`;
    return this.http.post(url, item, options)
      .pipe(
        map(() => new ApiResponse<{}>(true)),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<{}>(false, null, err));
        }),
      );
  }

  removeItem(productId: number): Observable<ApiResponse<{}>> {
    const url = `${Config.apiUrl}/shopping-cart/${productId}`;
    return this.http.delete(url, options)
      .pipe(
        map(() => new ApiResponse<{}>(true)),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<{}>(false, null, err));
        }),
      );
  }

  updateQuantity(productId: number, quantity: number): Observable<ApiResponse<{}>> {
    const url = `${Config.apiUrl}/shopping-cart/${productId}`;
    return this.http.put(url, { quantity: quantity }, options)
      .pipe(
        map(() => new ApiResponse<{}>(true)),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<{}>(false, null, err));
        }),
      );
  }

  emptyCart(): Observable<ApiResponse<{}>> {
    const url = `${Config.apiUrl}/shopping-cart`;
    return this.http.delete(url, options)
      .pipe(
        map(() => new ApiResponse<{}>(true)),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<{}>(false, null, err));
        }),
      );
  }
}

