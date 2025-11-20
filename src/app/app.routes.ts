import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth-component';
import { productResolver } from './resolvers/product-resolver';

export const routes: Routes = [
  // ---------------------------
  // ADMIN LOGIN PAGE
  // ---------------------------
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./pages/admin-login-component/admin-login-component').then(
        (m) => m.AdminLoginComponent
      ),
  },

  // ---------------------------
  // ADMIN AREA (Protected)
  // ---------------------------
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-component').then((m) => m.AdminComponent),
    resolve: { products: productResolver },
  },

  // ---------------------------
  // CUSTOMER APP
  // ---------------------------
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home-component').then((m) => m.HomeComponent),
    resolve: { products: productResolver },
  },

  // Login for customers
  { path: 'login', component: AuthComponent },

  // Default redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Unknown route
  { path: '**', redirectTo: 'login' },
];
