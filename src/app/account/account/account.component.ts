import { Injectable } from '@angular/core';
import { Component, HostListener, inject, OnInit} from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthGoogleService } from '../../services/auth/google.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { ChangeComponent } from '../change/change.component';
import { UserDataService } from '../../services/custumer/custumer.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})


export class AccountComponent implements OnInit{
  private googleService = inject(AuthGoogleService);
  private router = inject(Router);  
  private tokens = localStorage.getItem('auth');
  data: any; //prova
  address1: any; // contiene la prima riga di indirizzo
  country: any; // contiene il paese
  city: any; // contiene la città

  name: any;
  middle: any;
  last: any;
  phone: any;
  mail: any;
  userAddress: any[] = []; // contiene il risultato get USER - ADDRESS
  addressFinal: any; // contiene il risultato get ADDRESS

  isDropdownOpen = false; // Stato che indica se il dropdown è aperto o chiuso
  images: string[] = [
    "https://bikeville.s3.cubbit.eu/images/account/greater-than.png",
    "https://bikeville.s3.cubbit.eu/images/account/down.png",
  ];

  currentArrow: string = this.images[0];
  constructor(private http: HttpClient, private userDataService: UserDataService, private tokenService: TokenService){
    console.log(tokenService.getTokenData());
  }

  ngOnInit(): void {
    this.data = this.tokenService.getTokenData();

    this.userDataService.getUserAddress(this.data.nameid).subscribe({
      next: (response) => {
        if(response.length == 0){
          return console.log("hei, nada indirizzo qua");
        }
        this.userAddress = response;
        this.userDataService.getAddress(this.userAddress[0].addressId).subscribe({
          next: (response) => {
            this.addressFinal = response;
            console.log(this.addressFinal);
            this.address1 = this.addressFinal.addressLine1;
            this.address2 = this.addressFinal.addressLine2;
            this.city = this.addressFinal.city;
            this.country = this.addressFinal.countryRegion;
          },
          error: (error) => {
            let errorMessage = 'An error occurred in getAddress';
            console.log(error);
    
            if (error.error?.message) {
              errorMessage = error.error.message;
            }
          }
        });

      },
      error: (error) => {
        let errorMessage = 'An error occurred in getUserAddress';
        console.log(error);

        if (error.error?.message) {
          errorMessage = error.error.message;
        }
      }
    });

     this.userDataService.getUserData(this.data.nameid).subscribe({
      next: (response) => {
        const u = response;
        console.log(response);
        this.name = u.firstName;
        this.middle = u.middleName;
        this.last = u.lastName; 
        this.phone = u.phone; 
        this.mail = u.emailAddress; 
      
      },
      error: (error) => {
        let errorMessage = 'An error occurred in getUserData';
        console.log(errorMessage);
        console.log(error);

        if (error.error?.message) {
          errorMessage = error.error.message;
        }
      }
    });
  }

  changeProfile() {
    // this.change.changeProfile(this.data.sid);
    this.router.navigateByUrl('/change');
  }

  changeFaqs(){
    this.router.navigateByUrl('/faq');
  }

  changeAbout(){
    this.router.navigateByUrl('/about');
  }

  changePrivacy(){
    this.router.navigateByUrl('/privacy');
  }

  // Funzione per aprire o chiudere il dropdown
  toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    if(this.isDropdownOpen){
      this.currentArrow = this.images[1];
    }else{
      this.currentArrow = this.images[0];
    }
  }

  logout() {
    this.googleService.logout();
    this.router.navigateByUrl('/home');
  }

  // Ascolta i clic fuori dal menu per chiuderlo
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const dropdown = document.getElementById('dropdownMenu');
    const button = document.getElementById('dropdownButton');
    
    if (dropdown && button) {
      // Se il clic è fuori dal menu e dal bottone, chiudi il dropdown
      if (!dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
        this.isDropdownOpen = false;
        this.currentArrow = this.images[0];
      }
    }
  }

  

}




