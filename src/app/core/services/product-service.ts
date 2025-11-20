import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../shared/models/product.model';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Cached subjects
  private _categories = new BehaviorSubject<any[]>([]);
  categories$ = this._categories.asObservable();

  private _products = new BehaviorSubject<Product[]>([]);
  products$ = this._products.asObservable();

  constructor(private api: ApiService) {}

  // -----------------------------
  // LOAD & CACHE CATEGORIES
  // -----------------------------
  loadCategories() {
    if (this._categories.value.length === 0) {
      this.api.get<any[]>('categories').subscribe((res) => {
        this._categories.next(res);
      });
    }
  }

  // -----------------------------
  // LOAD & CACHE PRODUCTS
  // -----------------------------
  loadProducts() {
    if (this._products.value.length === 0) {
      this.api.get<Product[]>('products').subscribe((res) => {
        this._products.next(res);
      });
    }
  }

  // Direct API calls (used rarely)
  getCategories(): Observable<any[]> {
    return this.api.get<any[]>('categories');
  }

  getAllProducts(): Observable<any[]> {
    return this.api.get<any[]>('products');
  }

  // CRUD operations
  addProduct(data: any): Observable<any> {
    return this.api.post<any>('products', data);
  }

  updateProduct(productId: string, data: any): Observable<any> {
    return this.api.put<any>(`products/${productId}`, data);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.api.delete<any>(`products/${productId}`);
  }

  getProduct(id: string): Observable<Product> {
    return this.api.get<Product>(`products/${id}`);
  }
  // For product-list component compatibility
  getProducts(categoryId?: string): Observable<Product[]> {
    if (!categoryId) return this.products$;

    return new Observable((sub) => {
      const filtered = this._products.value.filter((p) => p.categoryID === categoryId);
      sub.next(filtered);
      sub.complete();
    });
  }
}
