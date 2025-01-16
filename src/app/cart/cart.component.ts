import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart/cart.service';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../models/cart-item.model';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  dropdownStates: { [key: number]: boolean } = {};
  cartItems: CartItem[] = [];
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    const cart = this.cartService.getCartItems();
    this.cartService.setCartItems(cart);
    
    this.cartItems = cart;
    this.cartItems.forEach((item, index) => {
      this.dropdownStates[index] = false;
    });
    this.calculateTotalAmount();
  }

  saveQuantity(item: CartItem) {
    if (item.orderQty < 1) {
      alert('La quantità deve essere almeno 1.');
      return;
    }
  
    this.cartService.updateCartItems(item); // Ricarica gli item aggiornati nel carrello
    this.calculateTotalAmount(); 
  }

  removeItem(productId: number | undefined) {
    if (confirm('Are you sure you want to remove this item?')) {
      this.cartService.removeFromCart(productId);
      this.cartItems = this.cartItems.filter(item => !(item.productId === productId));
      this.calculateTotalAmount();
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

  emptyCart() {
    if (confirm('Are you sure you want to empty the cart?')) {
      this.cartItems = []; // clear the cart items array
      this.cartService.clearCart(); // cart.service method to clear the cart from local storage
      this.calculateTotalAmount(); // recalculate total amount
    }
  }
}
