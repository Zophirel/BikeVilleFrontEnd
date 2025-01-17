import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../product/product.module';
import { MatIcon } from '@angular/material/icon';
import { CartService } from '../services/cart/cart.service';
import { AuthService } from '../services/auth/auth-service.service';
import { ProductCart } from '../models/product-cart.model';

@Component({
  selector: 'app-product-tile',
  standalone: true,
  imports: [MatIcon,],
  templateUrl: './product-tile.component.html',
  styleUrls: ['./product-tile.component.scss'],
})
export class ProductTileComponent {
  @Input() product: Product | undefined;
  // Prodotto singolo

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  navigateToProduct(): void {
    if (this.product?.productId) {
      this.router.navigate(['/product', this.product.productId]);
    }
  }
addToCart(): void {
   //event.stopPropagation();
    if (this.product) {
      const userId = this.authService.getIdToken(); // Ottieni l'ID dell'utente dal token
      if (userId) {
        // Passiamo tutte le proprietà richieste
        const productDetails: ProductCart = {
          productId: this.product.productId,
          userId: userId,
          name: this.product.name,
          largePhoto: this.product.largePhoto,
          price: this.product.listPrice ?? 0
        };
  
        this.cartService.addProductToCart(productDetails);
      } else {
        console.log('Utente non autenticato. Reindirizzamento alla pagina di login.');
        this.router.navigate(['/login']);
      }
    }
  }
}

