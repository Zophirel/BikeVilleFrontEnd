import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PasswordInputComponent } from '../../password-input/password-input.component';
import { AuthService } from '../../services/auth-service.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, PasswordInputComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent {
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  private authService: AuthService;

  constructor(auth : AuthService){
    this.authService = auth;
  }

  ngOnInit() {
    this.authService.checkAuth().subscribe((response) => {
      if(response.status == 200){
        console.log('Authenticated');
      }
    });
  }

  getSignupForm() {}

  onSubmit(form : NgForm) {
    console.log(this.authService.auth) ;
  } 

}