import { Component, input, Input } from '@angular/core';
import { Product } from '../product/product.module';

@Component({
    selector: 'app-product-tile',
    imports: [],
    templateUrl: './product-tile.component.html',
    styleUrl: './product-tile.component.scss'
})

export class ProductTileComponent {
  @Input() product: Product | undefined;


  getRandomImage(): string {
    return "assets/slider/" + Math.floor(Math.random() * 3) + ".webp";
  }
}
