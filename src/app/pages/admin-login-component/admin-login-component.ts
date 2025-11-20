import { Component } from '@angular/core';
import { AdminService } from '../../core/services/admin-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login-component.html',
  styleUrls: ['./admin-login-component.scss'],
})
export class AdminLoginComponent {
  mobile = '';
  password = '';
  loginError = '';

  constructor(private adminService: AdminService, private router: Router) {}

  loginAdmin() {
    this.adminService.loginAdmin(this.mobile, this.password).subscribe({
      next: (res) => {
        if (res && res.isValid) {
          localStorage.setItem('adminToken', 'true');
          this.router.navigate(['/admin']);
        } else {
          this.loginError = 'Invalid admin credentials';
        }
      },
      error: () => {
        this.loginError = 'Invalid admin credentials';
      },
    });
  }
}
