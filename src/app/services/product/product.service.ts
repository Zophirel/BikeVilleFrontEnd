import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { ProductDescription } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productUrl = 'https://zophirel.it/api/Product';
  private productDescriptionUrl = 'https://zophirel.it/api/ProductDescription';

  constructor(private http: HttpClient) {}

  getProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productUrl);
  }

  getProductDescription(productId: number): Observable<ProductDescription> {
    return this.http.get<ProductDescription>(`${this.productDescriptionUrl}/${productId}`);
  }
}