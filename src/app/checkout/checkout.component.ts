import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart/cart.service';
import { OrderShipping } from '../models/order-shipping.model';
import { TokenService } from '../services/token.service';
import { UserDataService } from '../services/custumer/custumer.service';
import { switchMap, of } from 'rxjs';

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

  constructor(private cartService: CartService, private tokenService: TokenService, private userDataService: UserDataService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.quantity = this.cartService.getNumberOfItems();
    this.total = this.cartService.getTotal();

    this.loadShippingAddress();
  }

  loadShippingAddress() {
    const data = this.tokenService.getTokenData();
    this.userDataService.getUserAddress(data.nameid).pipe(
      switchMap(addresses => {
        if (addresses.length) {
          const firstAddress = addresses[0];
          return this.userDataService.getAddress(firstAddress.addressId);
        }

        return of(null);
      })
    ).subscribe({
      next: (userAddress) => {
        console.log(userAddress);
        if(userAddress){
          this.address = {
            addressLine1: userAddress.addressLine1,
            city: userAddress.city,
            stateProvince: userAddress.stateProvince,
            countryRegion: userAddress.countryRegion,
            postalCode: userAddress.postalCode
          }
        }
        this.cdr.detectChanges(); //forza rilevamento modifiche
      },
      error: (error) => {
        console.error('Error loading shipping address:', error);
      }
    });
  }
}
