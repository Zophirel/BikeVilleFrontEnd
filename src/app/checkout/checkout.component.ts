import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart/cart.service';
import { AddressService } from '../services/address/address.service';
import { OrderShipping } from '../models/order-shipping.model';

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
  address: OrderShipping | undefined;

  constructor(private cartService: CartService, private addressService: AddressService) {}

  ngOnInit() {
    this.quantity = this.cartService.getNumberOfItems();
    this.total = this.cartService.getTotal();

    const shippingAddressId = this.cartService.getShippingAddressId();

    if(shippingAddressId){
      this.loadShippingAddress(shippingAddressId);
    }
  }

  loadShippingAddress(orderId: string) {
    this.addressService.getAddress(orderId).subscribe({
      next: (address) => {
        this.address = address; 
      },
      error: (error) => {
        console.error('Error loading shipping address:', error);
      }
    });
  }
}