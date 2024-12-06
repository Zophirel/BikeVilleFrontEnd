import { Component, Input, OnInit } from '@angular/core';
import { ProductTileComponent } from '../product-tile/product-tile.component';
import { Product } from '../product/product.module';

@Component({
    selector: 'app-product-list',
    imports: [ProductTileComponent],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss'
})

export class ProductListComponent implements OnInit {

  @Input() productsData: Map<string, Product[]>  = new Map<string, Product[]>();
  @Input() title : string | undefined;
  
  products : Product[] = []; 

  ngOnInit(): void {
    let productNames = this.productsData?.keys();
  
    for(let p of this.productsData){
      this.products.push(p[1][0]);
    }
  }
  
}
