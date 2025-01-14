import { Component, inject, Injectable } from '@angular/core';
import { ProductService } from '../services/products/product.service';
import { Product } from '../product/product.module';
import { ProductDescription } from '../services/product/product.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { SliderComponent } from '../slider/slider.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { AuthGoogleService } from '../services/auth/google.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [NavbarComponent, SliderComponent, ProductListComponent],
})

@Injectable({ providedIn: 'root' })

export class HomeComponent {
  homeProducts: Product[] = []; // Lista di prodotti per la home
  productsMapByCategory: Map<string, Product[]> = new Map(); // Mappa per prodotti per categoria
  productDescription: ProductDescription | null = null;
  private googleService: AuthGoogleService = inject(AuthGoogleService);

  constructor(private productService: ProductService, ) {
    console.log(localStorage.getItem('auth'));
    this.loadProductsList();
  }

  loadProductsList(): void {
    this.productService.getAllProducts().subscribe({
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
        console.log('Prodotti per la home:', this.homeProducts);
      },
      error: (err) => {
        console.error('Errore durante il caricamento dei prodotti:', err);
      },
    });
  }
}
