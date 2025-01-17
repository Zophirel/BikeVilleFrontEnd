import { ChangeDetectionStrategy, Component, effect, inject, Injectable, signal } from '@angular/core';
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
import { AuthGoogleService } from '../../services/auth/google.service';
import { MessageStatus } from '../signup/Enums';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
    
],
changeDetection: ChangeDetectionStrategy.OnPush,
})

@Injectable({ providedIn: 'root' })

export class LoginComponent {
  private authService = inject(AuthService);  
  private _snackBar = inject(MatSnackBar);
  private googleService = inject(AuthGoogleService);
  private router = inject(Router);  
  private loading = signal<boolean>(false); 
  
  messageStatus: MessageStatus = MessageStatus.Info;
  email: string | null = null;
  password: string | null = null; 
  submitted: boolean  = false; 
  error : Object | null = null; 
  private authWithGoogle : Subscription | null = null;
  private loginSubscription : Subscription | null = null; 

  constructor(authService: AuthService) {
    this.authService = authService;
    
    effect( () => {
      const profileData = this.googleService.profile();
      const idToken = this.googleService.getIdToken();
      console.log('idToken: ' + idToken);
      
      if(idToken){
       this.authWithGoogle = this.authService.authWithGoogle(idToken).subscribe({
          next: (data) => {
            console.log('The next value is: ', data);
            localStorage.setItem('auth', data.body);
          },
          
          error: (err) => {
            this.messageStatus = MessageStatus.Error;
            this.openSnackBar(err.error, 'Close');
          },
          complete: async () => {
            console.log('There are no more actions to happen.')
            this.loading.set(false);
            
            this.messageStatus = MessageStatus.Success;
            await this.router.navigateByUrl('/home');
            this.openSnackBar("Successfully logged in!", 'Close');
            
       
          }
        })
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 3000});
  } 

  loginWithGoogle() {
    console.log('Login with Google');
    this.googleService.login();
  }

  login() {
    console.log({ email: this.email, password: this.password });
    
    if (!this.email || !this.password) return;
  
    this.loginSubscription = this.authService.login(this.email, this.password).subscribe({
      next: (data) => {
        console.log('The next value is: ', data);
        localStorage.setItem('auth', data.body); 
        this.openSnackBar("Logged in successfully!", 'Close'); 
        setTimeout(async () => {
          await this.router.navigateByUrl('/home');  
        }, 3000);
        
      },
      error: (err) => {
        console.error('An error occurred:', err);
        console.log('Full error details:', err.message);
        this.openSnackBar(err.error, 'Close');
      },
      complete: () => {console.log('There are no more actions to happen.')}
    });
  }

  ngOnDestroy(): void {
    this.authWithGoogle?.unsubscribe();
    this.loginSubscription?.unsubscribe();
  }

}