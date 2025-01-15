import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NavbarComponent } from '../../navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import * as countriesJson from 'iso-3166-2.json';
import { passwordValidator } from './password-validator';
import { AuthGoogleService } from '../../services/auth/google.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SignUpData } from '../../services/auth/models/sign-up-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageStatus } from './Enums';
import EmailMatcher from './models/EmailMatcher';
import PasswordMatcher from './models/PasswordMatcher';
import Country  from './models/Country';
import { Subscription } from 'rxjs';


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
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SignupComponent {

  @ViewChild('inputCountry') inputCountry: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('inputState') inputState: ElementRef<HTMLInputElement> | undefined;
  router = inject(Router);
  emailFormControl = new FormControl('', 
    [
      Validators.required, 
      Validators.email, 
    ]
  );

  passwordFormControl = new FormControl('', [Validators.required, passwordValidator()]);
  signUpFormControl = new FormControl('', [Validators.required]);
  
  options: Country[] = [];
  filteredCountries: Country[];
  filteredState = signal<[string, string][]>([]); 
  
  emailMatcher = new EmailMatcher();
  passwordMatcher = new PasswordMatcher();  

  title: string = '';
  name: string = '';
  middle: string = ''; 
  surname: string = '';
  email: string = '';
  password: string = '';
  loading = signal(false);
  profile = signal(null);
  
  private authService: AuthService;
  private _snackBar = inject(MatSnackBar);
  messageStatus: MessageStatus = MessageStatus.Info;
  
  // async calls
  private authWithGoogleSubscription: Subscription | null = null;
  private signupSubscription: Subscription | null = null;
  private getCountriesJsonSubscription: Subscription | null = null;  


  constructor(auth : AuthService, public googleService: AuthGoogleService){
    this.authService = auth;
    this.filteredCountries = this.options.slice();
    this.profile = this.googleService.profile;
    
    if(this.router.url.includes('state')) {
      this.loading.set(true);
    }

    effect(() => {
      const idToken = this.googleService.getIdToken();

      if(idToken){
        this.authWithGoogleSubscription = this.authService.authWithGoogle(idToken).subscribe({
          next: (data) => {
            console.log('The next value is: ', data);
          },
          error: (err) => {
            this.messageStatus = MessageStatus.Error;
            this.openSnackBar(err.error, 'Close');
          },
          complete: async () => {
            console.log('There are no more actions to happen.')
            this.loading.set(false);
            
            this.messageStatus = MessageStatus.Success;
            this.openSnackBar("Successfully signed up! A verification email has been sent!", 'Close');
            await this.router.navigateByUrl('/home');
          }
        })
      }
    });
  }

  openSnackBar(message: string, action: string) {
    let messageStatusCss = '';
    if(this.messageStatus == MessageStatus.Error){
      messageStatusCss = 'snackbar-container-error';
    } else if(this.messageStatus == MessageStatus.Success){
      messageStatusCss = 'snackbar-container-success';
    } else if(this.messageStatus == MessageStatus.Info){
      messageStatusCss = 'snackbar-container-info';
    } else if(this.messageStatus == MessageStatus.Warning){
      messageStatusCss = 'snackbar-container-warning';
    }

    this._snackBar.open(message, action, {duration: 3000, panelClass: [messageStatusCss] });
  } 

  signUp() {
    console.log('Signing up...'); 
    const data = new SignUpData(this.title, this.name, this.middle, this.surname, this.email, this.password);
    console.log(JSON.stringify(data));

    if (!this.email || !this.password || !this.name || !this.surname) return;  
    this.signupSubscription = this.authService.signUp(data).subscribe({
      next: (data) => {
        console.log('The next value is: ', data);
      },
      error: (err) => {
        console.log('An error occurred:', err);
 
        this.messageStatus = MessageStatus.Error;
        this.openSnackBar(err.error, 'Close');
      },
      complete: () => {
        console.log('There are no more actions to happen.')
      }
    });  
  }

  signUpWithGoogle(){
    this.googleService.login()
  }

  ngOnInit() {
    this.getCountriesJsonSubscription = this.authService.getCountriesJson().subscribe((response) => { 
      this.options = JSON.parse(response.body);
    })
  }

  ngOnDestroy() {
    this.authWithGoogleSubscription?.unsubscribe();
    this.signupSubscription?.unsubscribe();
    this.getCountriesJsonSubscription?.unsubscribe();
  }

  setStateProvince(country: string) : void {
    const countries =  countriesJson as Record<string, any>;
    const countryData = countries[country];
    console.log(countryData.divisions);
    let entries = Object.entries<string>(countryData.divisions);
   
    entries = entries.filter(([key, value]) => {
      return Number.isNaN(parseInt(key.split("-")[1]));
    });

    entries.sort((a, b) => {
      if(a[1] < b[1]) { return -1; }
      if(a[1] > b[1]) { return 1; }
      return 0;
    });

    this.filteredState.set(entries);
  }

  onSubmit(form : NgForm) {
    console.log(this.authService.auth) ;
  } 

  filterCountry(): void {
    if (!this.inputCountry) {
      return;
    }

    if(this.inputState && this.inputState.nativeElement.value != ""){
      this.inputState!.nativeElement.value = "";
    }

    const filterValue = this.inputCountry.nativeElement.value.toLowerCase();
    this.filteredCountries = this.options.filter(o => o.name.toLowerCase().includes(filterValue));
  }

  filterStateProvince(): void {
    
    if (!this.inputState) {
      return;
    }
    const filterValue = this.inputState.nativeElement.value.toLowerCase();
    this.filteredState.set(this.filteredState().filter(o => o[1].toLowerCase().includes(filterValue)));
  }

  hide = signal(true);
  
  swapHide(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}