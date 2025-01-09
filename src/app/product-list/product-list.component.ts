import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductTileComponent } from '../product-tile/product-tile.component';
import { Product } from '../product/product.module';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [ProductTileComponent],
})
export class ProductListComponent implements OnChanges {
  @Input() homeProducts: Product[] | null = null;
  @Input() searchProducts: Map<string, Product[]> | null = null;
  @Input() title: string | undefined;

  products: Product[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['homeProducts'] || changes['searchProducts']) {
      console.log('Prodotti prima del filtraggio:', this.homeProducts, this.searchProducts);
      this.updateProducts();
      console.log('Prodotti finali:', this.products);
    }
  }

  private updateProducts(): void {
    this.products = [];

    if (this.homeProducts?.length) {
      this.products = this.homeProducts;
    } else if (this.searchProducts) {
      this.searchProducts.forEach((productList) => {
        this.products.push(...productList);
      });
    }
  }

  trackByFn(index: number, item: Product): number | undefined {
    return item.productId; // Ottimizzazione del rendering con un identificatore unico
  }
}
