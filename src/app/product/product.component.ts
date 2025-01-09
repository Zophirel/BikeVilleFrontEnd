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

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [NavbarComponent, ProductListComponent, CommonModule, FormsModule],
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

    // Carica categorie e prodotti organizzati
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
    // Ottieni la categoria di prodotto
    let category: ProductCategory | undefined;
    this.productsMapByCategory.forEach((productMap, cat) => {
      if (cat.productCategoryId === categoryId) {
        category = cat;
      }
    });

    // Se trovi la categoria, carica i prodotti associati
    if (category) {
      const categoryProducts = this.productsMapByCategory.get(category)?.get(category.productCategoryId.toString()) || [];
      this.categoryProducts = categoryProducts.filter(product => product.productId !== this.product?.productId);
    }
  }

  loadProductsList(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        const productsMap = this.productService.organizeProductsByCategory(products);
        this.productService.getAllProductCategories().subscribe({
          next: (categories) => {
            const categoriesMap = this.productService.organizeCategories(categories);
            this.productsMapByCategory = this.productService.bindProductToCategory(
              productsMap,
              categoriesMap
            );
          },
          error: (err) =>
            console.error('Errore durante il caricamento delle categorie:', err),
        });
      },
      error: (err) =>
        console.error('Errore durante il caricamento dei prodotti:', err),
    });
  }
}
