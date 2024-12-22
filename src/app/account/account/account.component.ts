import { Component, HostListener } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})

export class AccountComponent {
  isDropdownOpen = false; // Stato che indica se il dropdown è aperto o chiuso

  images: string[] = [
    "https://bikeville.s3.cubbit.eu/images%2Faccount%2Fgreater-than.png",
    "https://bikeville.s3.cubbit.eu/images%2Faccount%2Fdown.png",
  ];

  currentArrow: string = this.images[0];

  // Funzione per aprire o chiudere il dropdown
  toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    if(this.isDropdownOpen){
      this.currentArrow = this.images[1];
    }else{
      this.currentArrow = this.images[0];
    }
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



