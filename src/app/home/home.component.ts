import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Injectable, OnDestroy } from '@angular/core';
import { ProductService } from '../services/products/product.service';
import { Product } from '../product/product.module';
import { ProductDescription } from '../services/product/product.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { SliderComponent } from '../slider/slider.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { CacheService } from '../services/cache/cache.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [NavbarComponent, SliderComponent, ProductListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

@Injectable({ providedIn: 'root' })

export class HomeComponent implements OnDestroy {
  homeProducts: Product[] = []; // Lista di prodotti per la home
  productsMapByCategory: Map<string, Product[]> = new Map(); // Mappa per prodotti per categoria
  productDescription: ProductDescription | null = null;
  getAllProductsSubscription: Subscription | null = null;

  constructor(private productService: ProductService, private cacheService: CacheService, private cdRef: ChangeDetectorRef) {
    console.log(localStorage.getItem('auth'));
    
    if(this.cacheService.has('homeProducts')) {
      console.log('Caricamento dei prodotti dalla cache');
      this.homeProducts = this.cacheService.get('homeProducts')!;

      return;
    }

    this.loadProductsList();
  }


  loadProductsList(): void {


    this.getAllProductsSubscription = this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Organize products by category
        this.productsMapByCategory = this.productService.organizeProductsByCategory(products);

        // Take the first 4 products for each category
        const productsForHome: Product[] = [];
        console.log('Prodotti per categoria:', this.productsMapByCategory);
        let i = 0;
        
        for (let productList of this.productsMapByCategory.keys()) {
          if(i == 4) break;

          let elem = this.productsMapByCategory.get(productList)![0];
          productsForHome.push(elem); // Cambia il numero di prodotti mostrati
          i++;
        }
        
        this.homeProducts = productsForHome;
        this.cacheService.set('homeProducts', this.homeProducts); 
      },
      error: (err) => {
        console.error('Errore durante il caricamento dei prodotti:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.getAllProductsSubscription?.unsubscribe();
  }
}
