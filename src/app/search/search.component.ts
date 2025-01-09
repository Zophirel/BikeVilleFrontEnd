import { Component, Injectable, OnInit, Signal, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ProductListComponent } from '../product-list/product-list.component';
import { FilterComponent } from '../filter/filter.component';
import { OrderComponent } from "../order/order.component";
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../services/products/product.service';
import { ProductCategory } from '../product/product-category.module';
import { Product } from '../product/product.module';
import { map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EmittedFilterValue, EmittedOrderValue } from '../filter-dialog/emitted-filter.module.';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-search',
    imports: [
        NavbarComponent,
        MatTabsModule,
        ProductListComponent,
        FilterComponent,
        OrderComponent,
        MatButtonModule,
        CommonModule,
        RouterModule
    ],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
@Injectable({ providedIn: 'root' })

export class SearchComponent implements OnInit {

  tabSelectedIndex: number = 0;
  allCategories: Map<ProductCategory, ProductCategory[]> = new Map();
  categories: ProductCategory[] = [];
  currentCategory: ProductCategory | undefined; 
  allProducts: Map<string, Product[]> = new Map();
  productsByCategory: Map<ProductCategory, Map<string, Product[]>> = new Map();
  productsByCategoryCopy: Map<ProductCategory, Map<string, Product[]>> = new Map();
  productDataSignal = signal<Map<ProductCategory, Map<string, Product[]>>>(new Map());

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getAllProductCategories().pipe(
      switchMap(categories => {
        this.allCategories = this.productService.organizeCategories(categories);
        return this.productService.getAllProducts().pipe(
          map(products => {
           
            this.allProducts = this.productService.organizeProducts(products);
            this.productsByCategory = this.productService.bindProductToCategory(this.allProducts, this.allCategories);

            this.productsByCategoryCopy = this.productsByCategory;
            this.productDataSignal.set(this.productsByCategory);
            console.log(this.productDataSignal())
            
            this.categories = Array.from(this.allCategories.keys());

          })
        );
      })
    ).subscribe();
  }

  selectTab(index: number): void {
    this.currentCategory = this.categories[index];
  }

  search(event: Event): void {

    const query = (event.target as HTMLInputElement).value;    
    this.productsByCategory = new Map(this.productsByCategoryCopy);
    this.productDataSignal.set( this.productsByCategory);

    if (!query.trim()) return // Return the original map if the query is empty
    
    const searchResults = new Map<string, Product[]>();
    const lowerCaseQuery = query.toLowerCase();  
    const currentProducts = this.productsByCategory.get(this.currentCategory!);

    if(currentProducts != undefined){

      for (const [key, productList] of currentProducts) {
        if (key.toLowerCase().includes(lowerCaseQuery)) {
          searchResults.set(key, productList);
        }
      }

      let update = this.productDataSignal();
      update.set(this.currentCategory!, searchResults);
      this.productDataSignal.set(update);
    }
  }
  

  // Abstracted filtering logic
  private filterProducts(category: ProductCategory, subCategoryIds: string[]): Map<string, Product[]> {
    const selectedProducts = this.productsByCategory.get(category);
    if (!selectedProducts) return new Map();

    const filteredProducts = new Map<string, Product[]>();
    selectedProducts.forEach((productList, key) => {
      const filteredList = productList.filter(product =>
        subCategoryIds.includes(product.productCategoryId.toString())
      );
      if (filteredList.length > 0) {
        filteredProducts.set(key, filteredList);
      }
    });

    return filteredProducts;
  }

  categoriesEmitter(categories: EmittedFilterValue[]): void {
    const selectedSubCategories = categories.filter(cat => cat.selected);
    if (selectedSubCategories.length === 0) {
      this.productDataSignal.set(this.productsByCategory);
      return;
    }

    const selectedCategory = selectedSubCategories[0].category;
    const selectedSubCategoryIds = selectedSubCategories.map(cat => cat.id);

    const filteredProducts = this.filterProducts(selectedCategory, selectedSubCategoryIds.map((id) => id.toString()));
    const updatedData = new Map(this.productsByCategory);
    updatedData.set(selectedCategory, filteredProducts);

    this.productDataSignal.set(updatedData);
  }

  private resizeProductMap(productMap?: Map<string, Product[]>): Map<string, Product> {
    const resizedMap = new Map<string, Product>();
    if (!productMap) return resizedMap;

    productMap.forEach((productList, key) => {
      if (productList.length > 0) {
        resizedMap.set(key, productList[0]);
      }
    });

    return resizedMap;
  }

  private compareSizes(sizeA: string | null, sizeB: string | null): number {
    const sizeOrder: Record<string, number> = { s: 1, m: 2, l: 3, xl: 4 };
    const parseSize = (size: string | null): number =>
      size === null ? Infinity : sizeOrder[size.toLowerCase()] ?? Infinity;

    return parseSize(sizeA) - parseSize(sizeB);
  }

  private sortProducts(products: Product[], order: EmittedOrderValue): Product[] {
    return products.sort((a, b) => {
      switch (order.orderBy) {
        case 0: // Name
          return order.orderDirection ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        case 1: // Price
          return order.orderDirection ? a.listPrice - b.listPrice : b.listPrice - a.listPrice;
        case 2: // Size
          return order.orderDirection ? this.compareSizes(a.size, b.size) : this.compareSizes(b.size, a.size);
        case 3: // Weight
          return order.orderDirection ? a.weight - b.weight : b.weight - a.weight;
        case 4: // Date
          return order.orderDirection
            ? new Date(a.sellStartDate!).getTime() - new Date(b.sellStartDate!).getTime()
            : new Date(b.sellStartDate!).getTime() - new Date(a.sellStartDate!).getTime();
        default:
          return 0;
      }
    });
  }

  orderByEmitter(order: EmittedOrderValue): void {
    const updatedData = new Map(this.productDataSignal());
    const selectedProducts = updatedData.get(order.category);
    if (!selectedProducts) return;

    const comparableMap = this.resizeProductMap(selectedProducts);
    const orderedProducts = this.sortProducts(Array.from(comparableMap.values()), order);

    const orderedMap = new Map<string, Product[]>();
    orderedProducts.forEach(product => {
      const key = product.name;
      orderedMap.set(key, this.allProducts.get(key) || []);
    });

    updatedData.set(order.category, orderedMap);
    this.productDataSignal.set(updatedData);
  }
}