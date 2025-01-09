import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/products/product.service';
import { Product } from './product.module';
import { ProductDescription } from '../services/product/product.model';
import { ProductListComponent } from '../product-list/product-list.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { ProductCategory } from './product-category.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [NavbarComponent, ProductListComponent, CommonModule, FormsModule,MatIconModule,MatButtonModule],
})
export class ProductComponent implements OnInit {
  product: Product | null = null; // Prodotto singolo
  productDescription: ProductDescription | null = null; // Descrizione del prodotto
  productsMapByCategory: Map<ProductCategory, Map<string, Product[]>> = new Map(); // Mappa dei prodotti per categoria
  categoryProducts: Product[] = []; // Prodotti della stessa categoria del prodotto selezionato
  imageError = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Ottieni l'id del prodotto dalla rotta
    this.route.paramMap.subscribe((params) => {
      const productId = +params.get('id')!; 
      if (!isNaN(productId)) {
        this.fetchProduct(productId);
      }
    });
  }

  fetchProduct(productId: number): void {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loadCategoryProducts(product.productCategoryId);
      },
      error: (err) =>
        console.error('Errore durante il caricamento del prodotto:', err),
    });
  }

  loadCategoryProducts(categoryId: number): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Filtri direttamente tutti i prodotti ottenuti da getAllProducts
        this.categoryProducts = products.filter(
          (product) =>
            product.productCategoryId === categoryId &&
            product.productId !== this.product?.productId
        );
      },
      error: (err) =>
        console.error('Errore durante il caricamento dei prodotti correlati:', err),
    });
  }
    // Se trovi la categoria, carica i prodotti associati
  }
