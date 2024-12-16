import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart/cart.service'; // Importa il servizio

@Component({
  selector: 'checkout',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  quantity: number = 1;
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.quantity = this.cartService.getQuantity();
    this.total = this.cartService.getTotal();
  }
}