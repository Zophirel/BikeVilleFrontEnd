import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from '@angular/core';
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
import Countries from "../../../assets/jsonstatic/countries.json";
import * as countriesJson from 'iso-3166-2.json';
import { ErrorStateMatcher } from '@angular/material/core';
import { passwordValidator } from './password-validator';
import { GoogleAuthComponent } from '../../google-auth/google-auth.component';


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
      GoogleAuthComponent
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SignupComponent {

  @ViewChild('inputCountry') inputCountry: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('inputState') inputState: ElementRef<HTMLInputElement> | undefined;

  emailFormControl = new FormControl('', 
    [
      Validators.required, 
      Validators.email, 
    ]
  );

  passwordFormControl = new FormControl('', [Validators.required, passwordValidator()]);
  signUpFormControl = new FormControl('', [Validators.required]);
  
  options: Country[] = Countries;
  filteredCountries: Country[];
  filteredState = signal<[string, string][]>([]); 
  
  emailMatcher = new EmailMatcher();
  passwordMatcher = new PasswordMatcher();  
  
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  private authService: AuthService;

  constructor(auth : AuthService){
    this.authService = auth;
    this.filteredCountries = this.options.slice();
  }

  ngOnInit() {
    this.authService.checkAuth().subscribe((response) => {
      if(response.status == 200){
        console.log('Authenticated');
      }
    });
  }

  stateprovince(){
    console.log(this.filteredState);  
  }

  setStateProvince(country: string) : void {
    const countries = countriesJson as Record<string, any>;
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
    })

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
  
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

}

class Country {
  constructor(public name: string, public code: string) {}
}

/** Error when invalid control is dirty, touched, or submitted. */
class EmailMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

class PasswordMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}