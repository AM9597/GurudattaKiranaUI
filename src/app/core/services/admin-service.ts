import { Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { Product } from '../../shared/models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private api: ApiService) {}

  // ====================================================
  // MANAGEMENT (ADMIN) AUTHENTICATION
  // ====================================================

  // POST /management/login
  loginAdmin(mobile: string, password: string): Observable<any> {
    return this.api.post('management/login', { mobile, password });
  }

  // POST /management  -> Add new admin
  addAdmin(admin: { name: string; mobile: string; password: string }): Observable<any> {
    return this.api.post('management', admin);
  }

  // GET /management -> Get all admins
  getAdmins(): Observable<any[]> {
    return this.api.get<any[]>('management');
  }

  // ====================================================
  // PRODUCT CRUD
  // ====================================================

  // GET all products
  getProducts(): Observable<Product[]> {
    return this.api.get<Product[]>('products');
  }

  // POST - add new product
  addProduct(product: Product): Observable<Product> {
    return this.api.post<Product>('products', product);
  }

  // PUT - update product
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.api.put<Product>(`products/${id}`, product);
  }

  // DELETE - delete product
  deleteProduct(id: string): Observable<any> {
    return this.api.delete(`products/${id}`);
  }
}
