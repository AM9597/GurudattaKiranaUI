import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, catchError, of } from 'rxjs';
import { Customer } from '../../shared/models/customer.model';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _customer = new BehaviorSubject<Customer | null>(null);
  customer$ = this._customer.asObservable();

  constructor(private api: ApiService) {}

  /** Register user (backend storage) */
  register(data: Omit<Customer, 'customerID'>) {
    return this.api.post<Customer>('auth/register', data).pipe(
      tap((customer) => {
        this._customer.next(customer); // set logged-in customer
      })
    );
  }

  /** Login user (backend validation) */
  login(mobile: string, password: string) {
    return this.api
      .post<Customer>('auth/login', { mobile, password })
      .pipe(
        tap((customer) => this._customer.next(customer)),
        catchError((err) => {
          console.error('Login failed:', err);
          return of(null);
        })
      );
  }

  /** Logout user */
  logout() {
    this._customer.next(null);
  }

  /** Get current logged-in user */
  getCustomer(): Customer | null {
    return this._customer.value;
  }
}
