import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from './config';
import { catchError, map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ApiResponse } from './api-response';

/**
 * Defines a product.
 */
export class Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  features: string[];
}

export enum ProductsSortingCriteria {
  PriceLowHigh = 'price-asc',
  PriceHighLow = 'price-dsc',
  AlphaAscending = 'alpha-asc',
  AlphaDescending = 'alpha-dsc',
}

export enum ProductsCategories {
  Cameras = 'cameras',
  Computers = 'computers',
  Consoles = 'consoles',
  Screens = 'screens',
  All = '',
}

/**
 * Defines the service responsible to retrieve the products in the database.
 */
@Injectable()
export class ProductsService {

  /**
   * Initializes a new instance of the ProductsService class.
   *
   * @param http                    The HTTP service to use.
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets all the products in the database.
   *
   * @param [sortingCriteria]       The sorting criteria to use. If no value is specified, the list returned isn't sorted.
   * @param [category]              The category of the product. The default value is "all".
   * @return {Promise<Product[]>}   The category of the product. The default value is "all".
   */
  getProducts(sortingCriteria?: string, category?: string): Observable<ApiResponse<Product[]>> {
    const url = `${Config.apiUrl}/products`;
    let params = new HttpParams();
    if (category && category !== 'all') {
      params = params.append('category', category);
    }
    if (sortingCriteria) {
      params = params.append('criteria', sortingCriteria);
    }

    return this.http.get<Product[]>(url, { params: params })
      .pipe(
        take(1),
        map(products => new ApiResponse<Product[]>(true, products)),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<Product[]>(false, null, err));
        }),
      );
  }

  /**
   * Gets the product associated with the product ID specified.
   *
   * @param productId               The product ID associated with the product to retrieve.
   * @returns {Promise<Product>}    A promise that contains the product associated with the ID specified.
   */
  getProduct(productId: number): Observable<ApiResponse<Product>> {
    const url = `${Config.apiUrl}/products/${productId}`;
    return this.http.get<Product>(url)
      .pipe(
        take(1),
        map(product => new ApiResponse<Product>(true, product)),
        catchError(err => {
          console.error('An error occurred', err);
          return of(new ApiResponse<Product>(false, null, err));
        }),
      );
  }
}
