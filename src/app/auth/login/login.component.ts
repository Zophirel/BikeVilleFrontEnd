import { Component, Injectable } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth-service.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [CommonModule, FormsModule, RouterLink]
})

@Injectable({ providedIn: 'root' })

export class LoginComponent {
  private authService: AuthService;  

  email: string | null = null;
  password: string | null = null; 
  submitted: boolean = false; 

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  login(_ : NgForm) {
 
    if (this.email == null || this.password == null) 
      return;
    
    let request = this.authService.login(this.email, this.password)
      .subscribe((response) => {
        if(response.status == 200){
          this.authService.auth = btoa(this.email + ':' + this.password);
        }
      });
  }
}