import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../product/product.module';

@Component({
  selector: 'app-product-tile',
  standalone: true,
  templateUrl: './product-tile.component.html',
  styleUrls: ['./product-tile.component.scss'],
})
export class ProductTileComponent {
  @Input() product: Product | undefined;

  constructor(private router: Router) {}

  navigateToProduct(): void {
    if (this.product?.productId) {
      this.router.navigate(['/product', this.product.productId]);
    }
  }
}
