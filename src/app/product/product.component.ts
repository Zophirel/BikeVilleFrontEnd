import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/products/product.service';
import { Product } from './product.module';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductTileComponent } from "../product-tile/product-tile.component";
import { ProductListComponent } from "../product-list/product-list.component";
import { MatCardHeader, MatCardModule } from '@angular/material/card';  // Per i card
import { MatFormFieldModule } from '@angular/material/form-field';  // Per i form fields
import { MatSelectModule } from '@angular/material/select';  // Per i select dropdowns
import { MatDividerModule } from '@angular/material/divider';  // Per i divider
import { MatInputModule } from '@angular/material/input'; 
import { MatCard, MatCardContent,MatCardActions } from '@angular/material/card';
import { CartService } from '../services/cart/cart.service';
import { AuthService } from '../services/auth/auth-service.service';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [NavbarComponent,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardHeader,
    MatCard,
    MatCardContent, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatDividerModule,
    MatInputModule, 
    MatCardActions, 
    ProductListComponent],
})
export class ProductComponent implements OnInit {
  product: Product | null = null; // Prodotto singolo
  categoryProducts: Product[] = []; // Prodotti della stessa categoria del prodotto selezionato
  availableColors: string[] = []; // Colori disponibili
  availableSizes: string[] = []; // Taglie disponibili per il colore selezionato
  selectedColor: string = ''; // Colore selezionato
  selectedSize: string = ''; 
  relatedProductsSignal = signal<Map<string, Product[]>>(new Map()); // Segnale per i prodotti correlati
  cartProductIds: number[] = []; // Lista degli ID dei prodotti nel carrello

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = +params.get('id')!;
      if (!isNaN(productId)) {
        this.fetchProductAndGroupAttributes(productId);
      }
    });
  }
  /*
  addToCart(): void {
    if (this.product) {
      const userId = this.authService.getIdToken(); // Ottieni l'ID dell'utente dal token
      if (userId) {
        // Passiamo tutte le proprietà richieste
        const productDetails = {
          productId: this.product.productId,
          userId: userId,
          name: this.product.name,
          largePhoto: this.product.largePhoto,
          price: this.product.listPrice
        };
  
        this.cartService.addProductToCart(productDetails).subscribe(
          (response: any) => { 
            console.log('Prodotto aggiunto al carrello:', response);
          },
          (error: any) => { // Specifica anche il tipo di `error`
            console.error('Errore durante l\'aggiunta del prodotto al carrello:', error);
          }
        );
      } else {
        console.log('Utente non autenticato');
      }
    }
  }
*/
  fetchProductAndGroupAttributes(productId: number): void {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loadCategoryProducts(product.productCategoryId);
      },
      error: (err) => console.error('Errore durante il caricamento del prodotto:', err),
    });
  }

  loadCategoryProducts(categoryId: number): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        const categoryProducts = products.filter(
          (product) => product.productCategoryId === categoryId
        );
        const productMap = new Map<string, Product[]>();
        categoryProducts.forEach((product) => {
          if (!productMap.has(product.name)) {
            productMap.set(product.name, []);
          }
          productMap.get(product.name)!.push(product);
        });
        this.relatedProductsSignal.set(productMap);
        this.categoryProducts = categoryProducts;
        this.groupColorsAndSizes();
      },
      error: (err) =>
        console.error('Errore durante il caricamento dei prodotti correlati:', err),
    });
  }

  groupColorsAndSizes(): void {
    const colors = new Set<string>();
    const sizesByColor: { [color: string]: string[] } = {};
    this.categoryProducts.forEach((product) => {
      if (product.color) colors.add(product.color);
      if (product.size && product.color) {
        if (!sizesByColor[product.color]) {
          sizesByColor[product.color] = [];
        }
        sizesByColor[product.color].push(product.size);
      }
    });
    this.availableColors = Array.from(colors);
    if (this.availableColors.length > 0) {
      this.selectedColor = this.availableColors[0];
      this.updateSizesForSelectedColor();
    }
  }

  // Quando cambia il colore, aggiorno le taglie disponibili
  onColorChange(color: string): void {
    this.selectedColor = color;
    this.selectedSize = ''; 
    this.updateSizesForSelectedColor();
  }

  // Aggiorna le taglie per il colore selezionato
  updateSizesForSelectedColor(): void {
    const sizes = this.categoryProducts
      .filter((product) => product.color === this.selectedColor)
      .map((product) => product.size);
  
    this.availableSizes = Array.from(new Set(sizes));
  
    this.selectedSize = '';  // La taglia non viene pre-selezionata
  }

  // Quando la taglia cambia, aggiorna il prodotto visualizzato
  onSizeChange(): void {
    const selectedProduct = this.categoryProducts.find(
      (product) => product.color === this.selectedColor && product.size === this.selectedSize
    );
    if (selectedProduct) {
      this.product = selectedProduct; 
    }
  }
}