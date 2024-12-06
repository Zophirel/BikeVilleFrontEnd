import { Component, Injectable, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatTabsModule } from '@angular/material/tabs'; 
import { ProductListComponent } from '../product-list/product-list.component';
import { FilterComponent } from '../filter/filter.component';
import { OrderComponent } from "../order/order.component";
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../services/products/product.service';
import { ProductCategory } from '../product/product-category.module';
import { Product } from '../product/product.module';
import { map, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-search',
    imports: [
        NavbarComponent,
        MatTabsModule,
        ProductListComponent,
        FilterComponent,
        OrderComponent,
        MatButtonModule,
        CommonModule
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})

@Injectable({providedIn: 'root'})

export class SearchComponent implements OnInit {
  tabSelectedIndex : Number = 0;
  allCategories : Map<ProductCategory, ProductCategory[]> = new Map<ProductCategory, ProductCategory[]>();
  categories : ProductCategory[] = [];
  allProducts : Map<string, Product[]> = new Map<string, Product[]>();
  productsByCategory : Map<ProductCategory,  Map<string, Product[]>> = new Map<ProductCategory, Map<string, Product[]>>();
  productsByCategory$: Observable<Map<ProductCategory, Map<string, Product[]>>> | null = null;
  
  constructor(private productService: ProductService) { }

  categoriesEmitter(categories: Array<any>){
    console.log("CATEGORIES EMITTER");
    console.log(categories);
  }

  ngOnInit(): void {
    this.productsByCategory$ = this.productService.getAllProductCategories().pipe(
      switchMap(categories => {
        this.allCategories = this.productService.organizeCategories(categories);
        return this.productService.getAllProducts().pipe(
          map(products => {
            this.allProducts = this.productService.organizeProducts(products);
            return this.productService.bindProductToCategory(this.allProducts, this.allCategories);
          })
        );
      })
    );
  }
  
  selectTab(index: Number){
    this.tabSelectedIndex = index;
  }
}
