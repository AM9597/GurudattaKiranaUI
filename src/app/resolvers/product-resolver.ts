import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ProductService } from '../core/services/product-service';
import { filter, first, tap } from 'rxjs/operators';
import { Product } from '../shared/models/product.model';

export const productResolver: ResolveFn<Product[]> = () => {
  const productService = inject(ProductService);

  // Trigger backend loads
  productService.loadCategories();
  productService.loadProducts();

  // WAIT until products load
  return productService.products$.pipe(
    filter(products => products.length > 0),
    first(),
    tap(() => console.log("Resolver: Products loaded")),
  );
};
