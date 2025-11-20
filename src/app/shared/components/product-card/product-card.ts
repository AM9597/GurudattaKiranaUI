import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartService } from '../../../core/services/cart-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input() product!: Product;
  qty = 1;
  constructor(private cart: CartService) {}
  addToCart() {
    this.cart.add(this.product, this.qty);
    this.qty = 1;
  }
}
