import { Component, inject, Injectable } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButton,
    MatCardModule,
    MatInputModule,
    NavbarComponent,
    NavbarComponent,
    MatIconModule
]
})

@Injectable({ providedIn: 'root' })

export class LoginComponent {
  private authService: AuthService;  
  private _snackBar = inject(MatSnackBar);
  email: string | null = null;
  password: string | null = null; 
  submitted: boolean = false; 

  error : Object | null = null; 

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 5000});
  } 

  login(_: NgForm) {
    console.log({ email: this.email, password: this.password });
    
    if (!this.email || !this.password) return;
  
    this.authService.login(this.email, this.password).subscribe({
      next: (data) => {
        console.log('The next value is: ', data);
      },
      error: (err) => {
        console.error('An error occurred:', err);
        console.log('Full error details:', err.message);
        this.openSnackBar('An error occurred: ' + err.message, 'Close');
      },
      complete: () => {console.log('There are no more actions to happen.')}
    });
  }
}