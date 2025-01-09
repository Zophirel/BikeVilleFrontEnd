import { Component, Injectable } from '@angular/core';
import { ProductService } from '../services/products/product.service';
import { Product } from '../product/product.module';
import { ProductDescription } from '../services/product/product.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { SliderComponent } from '../slider/slider.component';
import { ProductListComponent } from '../product-list/product-list.component';

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

  constructor(private productService: ProductService) {
    this.loadProductsList();
  }

  loadProductsList(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Organizza i prodotti per categoria
        this.productsMapByCategory = this.productService.organizeProductsByCategory(products);

        // Per la home, estrai i primi 4 prodotti per ogni categoria (opzionale)
        const productsForHome: Product[] = [];
        for (let productList of this.productsMapByCategory.values()) {
          productsForHome.push(...productList.slice(0, 4)); // Cambia il numero di prodotti mostrati
        }
        this.homeProducts = productsForHome;

        console.log('Prodotti per categoria:', this.productsMapByCategory);
        console.log('Prodotti per la home:', this.homeProducts);
      },
      error: (err) => {
        console.error('Errore durante il caricamento dei prodotti:', err);
      },
    });
  }
}
