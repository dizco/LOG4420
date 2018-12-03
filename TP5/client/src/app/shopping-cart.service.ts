import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { ApiResponse } from './api-response';
import { Config } from './config';
import { catchError, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
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
  private isLoaded = false;
  items: ShoppingCartItem[] = [];

  constructor(private http: HttpClient) { }

  loadItems(): Observable<ApiResponse<ShoppingCartItem[]>> {
    if (this.isLoaded) {
      return of(new ApiResponse(true, this.items));
    }
    this.isLoaded = true;

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
        tap(items => this.items = items), //Set the items variable
        map(items => new ApiResponse<ShoppingCartItem[]>(true, items)),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<ShoppingCartItem[]>(false, null, err));
        }),
      );
  }

  get itemsCount(): number {
    if (!this.items || this.items.length === 0) {
      return 0;
    }
    const reducer = (accumulator: number, current: number) => accumulator + current;
    return this.items.map(item => item.quantity).reduce(reducer);
  }

  addItem(item: ShoppingCartItem): Observable<ApiResponse<{}>> {
    const url = `${Config.apiUrl}/shopping-cart`;
    const itemIdx: number = this.items.findIndex(existingItem => existingItem.product.id === item.product.id);
    if (itemIdx !== -1) {
      return this.http.put(url + '/' + this.items[itemIdx].product.id, { quantity: this.items[itemIdx].quantity + item.quantity }, options)
        .pipe(
          tap(() => this.items[itemIdx].quantity += item.quantity),
          map(() => new ApiResponse<{}>(true)),
          catchError(err => {
            console.error('An error occurred', err);
            return of(new ApiResponse<{}>(false, null, err));
          }),
        );
    } else {
      return this.http.post(url, { productId: item.product.id, quantity: item.quantity }, options)
        .pipe(
          tap(() => this.items.push(item)),
          map(() => new ApiResponse<{}>(true)),
          catchError(err => {
            console.error('An error occurred', err);
            return of(new ApiResponse<{}>(false, null, err));
          }),
        );
    }
  }

  removeItem(productId: number): Observable<ApiResponse<{}>> {
    const url = `${Config.apiUrl}/shopping-cart/${productId}`;
    return this.http.delete(url, options)
      .pipe(
        tap(() => this.items = this.items.filter(item => item.product.id !== productId)),
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
        tap(() => this.items.filter(item => item.product.id === productId).map(item => item.quantity = quantity)),
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
        tap(() => this.items = []),
        map(() => new ApiResponse<{}>(true)),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<{}>(false, null, err));
        }),
      );
  }
}

