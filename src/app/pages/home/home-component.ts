import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../core/services/cart-service';
import { ProductService } from '../../core/services/product-service';
import { AuthService } from '../../core/services/auth-service';
import { Product } from '../../shared/models/product.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.scss'],
})
export class HomeComponent {
  customerName: string = '';
  categories: any[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string | null = null;
  showCart = false;

  constructor(
    public authService: AuthService,
    public productService: ProductService,
    public cartService: CartService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load cached data from service
    this.products = this.route.snapshot.data['products'] as Product[];
    this.filteredProducts = this.products;

    this.productService.categories$.subscribe((res) => {
      this.categories = res;
    });

    this.productService.products$.subscribe((res) => {
      this.products = res;
      this.filteredProducts = res;
    });
    this.cartService.items$.subscribe(() => {
      this.cdr.markForCheck();
    });

    // Customer
    const customer = this.authService.getCustomer();
    this.customerName = customer ? customer.name : '';
  }

  // Filter by category
  selectCategory(categoryID: string) {
    this.selectedCategory = categoryID;

    this.filteredProducts =
      categoryID === null
        ? this.products
        : this.products.filter((p) => p.categoryID === categoryID);
  }

  // ---------------------
  // CART LOGIC
  // ---------------------

  addToCart(product: Product) {
    this.cartService.add(product, 1);
  }

  increaseQty(product: Product) {
    this.cartService.increase(product.productID);
  }

  decreaseQty(product: Product) {
    const qty = this.cartService.getItemQuantity(product.productID);

    if (qty > 1) {
      this.cartService.decrease(product.productID);
    } else {
      this.cartService.remove(product.productID);
    }
  }

  getQuantity(productID: string) {
    return this.cartService.getItemQuantity(productID);
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  // Total
  get cartTotal(): number {
    return this.cartService.getItems().reduce((acc: number, item: CartItem) => {
      return acc + item.product.price * item.qty;
    }, 0);
  }

  checkout() {
    const cart = this.cartService.getItems();
    const customer = this.authService.getCustomer();

    if (!cart || cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!customer) {
      alert('You must be logged in to order.');
      return;
    }

    // Build WhatsApp message
    let message = '🛒 *New Grocery Order* %0A%0A';
    message += '*Customer Details:* %0A';
    message += `• Name: ${customer.name} %0A`;
    message += `• Mobile: ${customer.mobile} %0A`;
    message += `• Address: ${customer.address} %0A%0A`;

    message += '*Order Items:* %0A';
    cart.forEach((item) => {
      message += `• ${item.product.productName} — Qty: ${item.qty} — Rs ${
        item.product.price * item.qty
      }%0A`;
    });

    const total = cart.reduce((sum, c) => sum + c.product.price * c.qty, 0);
    message += `%0A*Total:* Rs ${total}%0A%0A`;
    message += 'Please confirm the order.';

    const phone = '917756980045';
    const url = `https://wa.me/${phone}?text=${message}`;

    const win = window.open(url, '_blank');

    if (!win) {
      alert('Please enable popups to send the WhatsApp message.');
      return;
    }

    // --------------------------------------------
    // 🔥 Clear cart AFTER WhatsApp tab is opened
    // --------------------------------------------
    win.onload = () => {
      this.cartService.clearAll();
      alert('Order sent successfully! Cart cleared.');
    };

    // Backup clear (in case onload doesn't fire)
    setTimeout(() => {
      this.cartService.clearAll();
    }, 3000);
  }

  logout() {
    this.authService.logout();
    this.customerName = '';
  }
}
