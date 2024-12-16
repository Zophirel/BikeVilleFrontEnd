import { Component, Injectable } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SliderComponent } from '../slider/slider.component';
import { ProductListComponent } from "../product-list/product-list.component";
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/products/product.service';
import { Product } from '../product/product.module';

@Component({
    selector: 'app-home',
    imports: [
        NavbarComponent, 
        SliderComponent, 
        ProductListComponent, 
        RouterModule
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})

@Injectable({ providedIn: 'root' })


export class HomeComponent {
    homeProducts: Product[] = [];
    
    constructor(private Products : ProductService) {
       
        this.Products.getAllProducts().subscribe(
            (products) => {
                let arr = Array.from( this.resizeProductMap(this.Products.organizeProducts(products)).entries());  
                this.homeProducts = arr.map((product) => {return product[1][0]});   
            }
        );
    }

    private resizeProductMap(productMap?: Map<string, Product[]>): Map<string, Product[]> {
        const resizedMap = new Map<string, Product[]>();
        if (!productMap) return resizedMap;
    
        productMap.forEach((productList, key) => {
          if (productList.length > 0) {
            resizedMap.set(key, [productList[0]]);
          }
        });
    
        return resizedMap;
    }
}
