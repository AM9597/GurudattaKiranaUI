import { Component } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { AdminService } from '../../core/services/admin-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-component.html',
  styleUrls: ['./admin-component.scss'],
})
export class AdminComponent {
  products: Product[] = [];

  productForm: Product = {
    productID: '',
    productName: '',
    price: 0,
    imageUrl: '',
    categoryID: '',
    description: '',
    isAvailable: true,
  };

  isEditing = false;

  constructor(private adminService: AdminService, private route: ActivatedRoute) {}

  ngOnInit() {
    // ✅ Load products from resolver first
    const resolved = this.route.snapshot.data['products'];
    this.products = resolved || [];

    // (Optional) If you click refresh inside the page
    // call backend again
    this.loadProducts();
  }

  // -----------------------------------
  // Load products
  // -----------------------------------
  loadProducts() {
    this.adminService.getProducts().subscribe((data) => {
      this.products = data ?? [];
    });
  }

  // -----------------------------------
  // Add / Update Product
  // -----------------------------------
  saveProduct() {
    if (this.isEditing) {
      // UPDATE
      this.adminService
        .updateProduct(this.productForm.productID, this.productForm)
        .subscribe(() => {
          alert('Product updated successfully.');
          this.resetForm();
          this.loadProducts();
        });
    } else {
      // ADD
      this.adminService.addProduct(this.productForm).subscribe(() => {
        alert('Product added successfully.');
        this.resetForm();
        this.loadProducts();
      });
    }
  }

  // -----------------------------------
  // Edit product
  // -----------------------------------
  editProduct(product: Product) {
    this.isEditing = true;
    this.productForm = { ...product }; // copy values
  }

  // -----------------------------------
  // Delete product
  // -----------------------------------
  deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.adminService.deleteProduct(id).subscribe(() => {
      alert('Product deleted successfully.');
      this.loadProducts();
    });
  }

  // -----------------------------------
  // Reset form
  // -----------------------------------
  resetForm() {
    this.isEditing = false;

    this.productForm = {
      productID: '',
      productName: '',
      price: 0,
      imageUrl: '',
      categoryID: '',
      description: '',
      isAvailable: true,
    };
  }
}
