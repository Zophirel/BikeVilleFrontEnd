import { Component, Input } from '@angular/core';
import { ProductTileComponent } from '../product-tile/product-tile.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductTileComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})

export class ProductListComponent {
  @Input() title: string = '';
  products: any = [
    {name: 'Product 1', price: 100, image: 'assets/slider/1.webp'},
    {name: 'Product 2', price: 200, image: 'assets/slider/2.webp'},
    {name: 'Product 3', price: 300, image: 'assets/slider/3.webp'},
  ];


}
