import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth/auth-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { passwordValidator } from '../auth/signup/password-validator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import PasswordMatcher from '../auth/signup/models/PasswordMatcher';
import { flatMap } from 'lodash';

@Component({
    selector: 'app-signup',
    imports: [
      RouterModule, 
      CommonModule, 
      FormsModule, 
      ReactiveFormsModule,
      MatFormFieldModule, 
      MatInputModule, 
      NavbarComponent,
      MatButtonModule,
      MatIconModule,
      MatSelectModule,
      MatAutocompleteModule,
      MatProgressSpinnerModule,
    ],
    templateUrl: './token-page.component.html',
    styleUrl: './token-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TokenPageComponent {
 
  router = inject(Router);
  passwordFormControl = new FormControl('', [Validators.required, passwordValidator()]);
  signUpFormControl = new FormControl('', [Validators.required]);
  passwordMatcher = new PasswordMatcher();  
  password: string = '';
  loading = signal(false);
  profile = signal(null);
  encodedToken: string = '';  
  tokenData: any = {};  
  isUserChangingPassword: boolean = false;  
  isUserMigrating: boolean = false;
  isUserVerifyingEmail: boolean = false;
  resultText: string = '';

  constructor(private auth: AuthService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    
    this.route.params.subscribe(params => {
      this.loading.set(true);
      this.encodedToken = params['encodedToken']; 
      this.tokenData = this.auth.getTokenData(this.encodedToken);
      
      if(!this.tokenData){
        this.router.navigateByUrl('/home');
        return;
      }
      
      if(this.tokenData.type === 'change-password'){
        this.isUserChangingPassword = true;
      } else if(this.tokenData.type === 'user-migration'){
        this.isUserMigrating = true;
      } else if(this.tokenData.type === 'email-validation'){
        this.isUserVerifyingEmail = true;
        this.auth.validateEmail(this.encodedToken).subscribe({
          next: (response: any) => {
            console.log("Email validated!");
            this.resultText = "Operation successful, please login to continue";
          },
          error: (error: any) => {
            console.log("Error validating email");
            console.log(error);
            this.resultText = "Operation failed, please try again";
          },
        });
      } else{
        this.resultText = "Invalid token";
      }
    });
    this.loading.set(false);
  }

  changePassword(){
    this.auth.changePassword(this.encodedToken, this.password).subscribe({
      next: (response: any) => {
        console.log("Password changed!");
        this.resultText = "Password changed successfully, please login to continue";
      },
      error: (error: any) => {
        console.log("Error changing password");
        console.log(error);
        this.resultText = "Password change failed, please try again";
      },
    });
  }

  migrateUser(){
    this.auth.migrateUser(this.encodedToken, this.password).subscribe({
      next: (response: any) => {
        console.log("User migrated!");
        this.resultText = "User migrated successfully, please login to continue";
      },
      error: (error: any) => {
        console.log("Error migrating user");
        console.log(error);
        this.resultText = "User migration failed, please try again";
      },
    });
  }

  hide = signal(true);
  
  swapHide(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}