import { Injectable } from '@angular/core';
import { Component, HostListener, inject, OnInit} from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthGoogleService } from '../../services/auth/google.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { ChangeComponent } from '../change/change.component';

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
  
  isDropdownOpen = false; // Stato che indica se il dropdown è aperto o chiuso
  images: string[] = [
    "https://bikeville.s3.cubbit.eu/images/account/greater-than.png",
    "https://bikeville.s3.cubbit.eu/images/account/down.png",
  ];

  currentArrow: string = this.images[0];
  constructor(private http: HttpClient){
    console.log(this.getTokenData(this.getIdToken()));
  }

  getAccessToken(){
    let tokens = localStorage.getItem('auth');
    if(tokens){
      let auth = JSON.parse(tokens);
      return auth[1];
    } 
  }

  getIdToken(){
    let tokens = localStorage.getItem('auth');
    if(tokens){
      let auth = JSON.parse(tokens);
      return auth[0];
    } 
  }

  getTokenData(token: string){
    let data = token.split('.')[1];
    let decodedData = atob(data);
    return JSON.parse(decodedData);
  }

  ngOnInit(): void {
    this.data = this.getTokenData(this.getIdToken());
  }

  changeProfile() {
    // this.change.changeProfile(this.data.sid);
    this.router.navigateByUrl('/change');
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




