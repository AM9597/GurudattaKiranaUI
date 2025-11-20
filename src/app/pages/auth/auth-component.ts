import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../shared/models/customer.model';

@Component({
  selector: 'app-auth-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-component.html',
  styleUrls: ['./auth-component.scss'],
})
export class AuthComponent {
  private redirectAfterLogin = false;
  isRegister = true;

  // Registration form
  regName = '';
  regMobile = '';
  regAddress = '';
  regPassword = '';

  // Login form
  loginMobile = '';
  loginPassword = '';

  loginError = '';
  registerError = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleForm() {
    this.isRegister = !this.isRegister;
    this.loginError = '';
    this.registerError = '';
  }

  // --------------------------
  // REGISTER
  // --------------------------
  register() {
    const customer: Omit<Customer, 'customerID'> = {
      name: this.regName,
      mobile: this.regMobile,
      address: this.regAddress,
      password: this.regPassword,
    };

    this.authService.register(customer).subscribe({
      next: (res) => {
        this.redirectAfterLogin = true;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.registerError = err.error || 'Registration failed.';
      },
    });
  }

  // --------------------------
  // LOGIN
  // --------------------------
  login() {
    this.authService.login(this.loginMobile, this.loginPassword).subscribe({
      next: (customer) => {
        if (customer) {
          this.redirectAfterLogin = true;
          this.router.navigate(['/home']);
        } else {
          this.loginError = 'Invalid mobile or password';
        }
      },
      error: () => {
        this.loginError = 'Invalid mobile or password';
      },
    });
  }
}
