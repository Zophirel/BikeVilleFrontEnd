import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProductTileComponent } from '../product-tile/product-tile.component';
import { Product } from '../product/product.module';

@Component({
  selector: 'app-product-list',
  imports: [ProductTileComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit, OnChanges {

  @Input() homeProducts : Product[] | null = null;
  @Input() searchProducts: Map<string, Product[]> | null = null;
  @Input() title: string | undefined;

  products: Product[] = [];

  ngOnInit(): void {
    console.log("ON INIT PRODUCT LIST");
    this.updateProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchProducts']) {
      this.updateProducts();
    }
  }

  private updateProducts(): void {
    this.products = []; // Reset the products array
    
    if (this.searchProducts) {
      for (const [, productList] of this.searchProducts) {
        this.products.push(productList[0]); // Add all products from the map
      }
    }
    console.log("Processed products:", this.products);
  }
}