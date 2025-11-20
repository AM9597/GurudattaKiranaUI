import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../shared/models/product.model';
import { ApiService } from './api-service';
import { AuthService } from './auth-service';

export interface CartItem {
  product: Product;
  qty: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _items = new BehaviorSubject<CartItem[]>([]);
  items$ = this._items.asObservable();

  private customerId: string = '';

  constructor(private api: ApiService, private auth: AuthService) {
    // Watch for login/logout and reload cart
    this.auth.customer$.subscribe((customer) => {
      this.customerId = customer?.customerID ?? '';
      if (this.customerId) {
        this.loadCartFromServer();
      } else {
        this._items.next([]); // logout clears cart
      }
    });
  }

  // -----------------------------------------
  // Load cart from backend
  // -----------------------------------------
  loadCartFromServer() {
    if (!this.customerId) return;

    this.api.get<CartItem[]>(`cart/${this.customerId}`).subscribe((cart) => {
      this._items.next(cart || []);
    });
  }

  getItems(): CartItem[] {
    return this._items.value;
  }

  // -----------------------------------------
  // Add to cart
  // -----------------------------------------
  add(product: Product, qty = 1) {
    if (!this.customerId) return;

    const body = { product, qty };

    this.api.post<CartItem[]>(`cart/${this.customerId}/add`, body).subscribe((updatedCart) => {
      this._items.next(updatedCart);
    });
  }

  // -----------------------------------------
  // Increase quantity
  // -----------------------------------------
  increase(productId: string) {
    if (!this.customerId) return;

    const item = this.getItems().find((i) => i.product.productID === productId);
    if (!item) return;

    const body = { product: item.product, qty: item.qty + 1 };

    this.api.post<CartItem[]>(`cart/${this.customerId}/update`, body).subscribe((updatedCart) => {
      this._items.next(updatedCart);
    });
  }

  // -----------------------------------------
  // Decrease quantity
  // -----------------------------------------
  decrease(productId: string) {
    if (!this.customerId) return;

    const item = this.getItems().find((i) => i.product.productID === productId);
    if (!item) return;

    const newQty = item.qty - 1;

    const body = { product: item.product, qty: newQty };

    this.api.post<CartItem[]>(`cart/${this.customerId}/update`, body).subscribe((updatedCart) => {
      this._items.next(updatedCart);
    });
  }

  // -----------------------------------------
  // Update qty manually
  // -----------------------------------------
  updateQty(productId: string, qty: number) {
    if (!this.customerId) return;

    const item = this.getItems().find((i) => i.product.productID === productId);
    if (!item) return;

    const body = { product: item.product, qty };

    this.api.post<CartItem[]>(`cart/${this.customerId}/update`, body).subscribe((updatedCart) => {
      this._items.next(updatedCart);
    });
  }

  // -----------------------------------------
  // Get quantity
  // -----------------------------------------
  getItemQuantity(productId: string): number {
    return this.getItems().find((i) => i.product.productID === productId)?.qty || 0;
  }

  // -----------------------------------------
  // Remove item
  // -----------------------------------------
  remove(productId: string) {
    if (!this.customerId) return;

    this.api
      .delete<CartItem[]>(`cart/${this.customerId}/remove/${productId}`)
      .subscribe((updatedCart) => {
        this._items.next(updatedCart);
      });
  }

  // -----------------------------------------
  // Clear whole cart
  // -----------------------------------------
  clearAll() {
    if (!this.customerId) return;

    this.api.delete<CartItem[]>(`cart/${this.customerId}/clear`).subscribe((emptyCart) => {
      this._items.next(emptyCart);
    });
  }
}
