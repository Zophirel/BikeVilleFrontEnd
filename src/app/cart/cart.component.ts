import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { CartService } from '../services/cart/cart.service';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent {
  // Variabile per gestire la visibilità del menu
  isDropdownVisible: boolean = false;
  selectedQuantity: number = 1; // Quantità di default
  pricePerItem: number = 120; // Prezzo per articolo (in questo esempio)

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  // Funzione per gestire il click sul pulsante Qta
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  // Funzione per gestire la selezione della quantità
  selectQuantity(quantity: number) {
    console.log('Quantità selezionata:', quantity);
    this.selectedQuantity = quantity;
    this.cartService.setQuantity(quantity); // Salva la quantità nel servizio
    this.isDropdownVisible = false; // Chiudere il menu dopo la selezione
  }

  calculateTotal(): number {
    return this.selectedQuantity * this.pricePerItem;
  }
  
  navigateToCheckout() {
    this.cartService.setTotal(this.calculateTotal()); // Salva il totale nel servizio
    this.router.navigate(['/checkout']);
  }
}
