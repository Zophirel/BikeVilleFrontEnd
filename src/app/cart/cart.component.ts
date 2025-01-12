import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart/cart.service';
import { SalesOrderDetail } from '../models/sales-order-detail.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  dropdownStates: { [key: number]: boolean } = {};
  cartItems: SalesOrderDetail[] = [];
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartService.setCartItems(items);
        this.cartItems = items;
        this.cartItems.forEach((item, index) => {
          this.dropdownStates[index] = false;
        });
        this.calculateTotalAmount();
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
      }
    });
  }

  updateQuantity(item: SalesOrderDetail, quantity: number, index: number) {
    if (quantity < 1) {
      item.orderQty = 1; // Imposta la quantità a 1 se l'utente inserisce un valore non valido
    }

    // Aggiorna la quantità nel carrello in memoria
    this.cartService.updateItemQuantity(item.salesOrderId, item.salesOrderDetailId, quantity).subscribe({
      next: () => {
        item.orderQty = quantity; // Aggiorna la quantità dell'item in memoria
        item.lineTotal = item.unitPrice * item.orderQty * (1 - item.unitPriceDiscount); // Ricalcola il totale della riga
        this.calculateTotalAmount(); // Ricalcola il totale del carrello
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
      }
    });
  }

  saveQuantity(item: SalesOrderDetail, index: number) {
    if (item.orderQty < 1) {
      alert('La quantità deve essere almeno 1.');
      return;
    }
  
    const updatedItem = {
      salesOrderId: item.salesOrderId,
      salesOrderDetailId: item.salesOrderDetailId,
      orderQty: item.orderQty,
    };
  
    console.log("Sending request to update quantity with data:", updatedItem);
  
    this.cartService.updateItemQuantity(item.salesOrderId, item.salesOrderDetailId, item.orderQty).subscribe({
      next: () => {
        this.calculateTotalAmount(); 
        this.cartService.updateCartItems(this.cartItems, item); // Ricarica gli item aggiornati nel carrello
      },
      error: (error) => {
        console.error('Error saving quantity:', error);
        alert('Si è verificato un errore durante l\'aggiornamento della quantità. Riprova più tardi.');
      }
    });
  }

  removeItem(salesOrderId: number, salesOrderDetailId: number) {
    if (confirm('Are you sure you want to remove this item?')) {
      this.cartService.removeFromCart(salesOrderId, salesOrderDetailId).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter(item =>
            !(item.salesOrderId === salesOrderId && item.salesOrderDetailId === salesOrderDetailId)
          );
          this.calculateTotalAmount();
        },
        error: (error) => {
          console.error('Error removing item:', error);
        }
      });
    }
  }

  calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((total, item) =>
      total + (item.unitPrice * item.orderQty * (1 - item.unitPriceDiscount)), 0);
  }

  navigateToCheckout() {
    this.cartService.setTotal(this.totalAmount);
    this.router.navigate(['/checkout']);
  }
}
