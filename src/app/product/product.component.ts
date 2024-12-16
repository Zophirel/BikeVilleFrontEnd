import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product/product.service';
import { Product } from '../services/product/product.model';
import { ProductListComponent } from '../product-list/product-list.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductDescription } from '../services/product/product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [NavbarComponent, ProductListComponent, CommonModule],
})
export class ProductComponent implements OnInit {
  product: Product | null = null; // Dati del prodotto
  productDescription: ProductDescription | null = null; 
  imageSrc: string | null = null;
  imageError = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProduct();
    this.fetchProductDescription(8); // Chiamata statica con ID `8` per la descrizione
  }

  fetchProduct(): void {
    const productId = 706;

    this.productService.getProduct().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          // Cerca il prodotto specifico
          this.product = data.find((p) => p.productId === productId) || null;
          if (this.product?.thumbNailPhoto) {
            // Converte la stringa esadecimale in Base64
            this.imageSrc = this.convertHexToBase64(this.product.thumbNailPhoto, 'image/gif');
            console.log('Image Source:', this.imageSrc); 
          } else {
            console.warn('Nessuna immagine disponibile per il prodotto.');
          }
        } else {
          console.error('Errore: il formato dei dati ricevuti non è un array.');
        }
      },
      error: (err) => console.error('Errore durante il recupero del prodotto:', err),
    });
  }
  
  fetchProductDescription(descriptionId: number): void {
    this.productService.getProductDescription(descriptionId).subscribe({
      next: (descriptionData) => {
        this.productDescription = descriptionData;
        console.log('Descrizione Prodotto:', this.productDescription); // Log per il debug
      },
      error: (err) => console.error('Errore durante il recupero della descrizione del prodotto:', err),
    });
  }
  onImageError(): void {
    this.imageError = true; // Mostra il fallback
  }


  /**
   * Converte una stringa esadecimale in un'immagine Base64
   * @param hexString La stringa esadecimale
   * @param mimeType Il tipo MIME dell'immagine (es. image/png)
   * @returns La stringa Base64 formattata come data URI
   */
  convertHexToBase64(hexString: string, mimeType: string): string {
    try {
      const byteArray = new Uint8Array(
        hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
      );
      const base64String = btoa(String.fromCharCode(...byteArray));
      return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      console.error('Errore durante la conversione dell’immagine:', error);
      return '';
    }
  }
}


