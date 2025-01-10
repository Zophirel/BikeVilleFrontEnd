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
import { ErrorStateMatcher } from '@angular/material/core';
import { passwordValidator } from '../../auth/signup/password-validator';
import { AuthGoogleService } from '../../services/auth/google.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SignUpData } from '../../services/auth/models/sign-up-data.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageStatus } from '../../auth/signup/Enums';


@Component({
  selector: 'app-change',
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
  templateUrl: './change.component.html',
  styleUrl: './change.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeComponent {
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
 
    title: string = '';
    name: string = '';
    middle: string = ''; 
    surname: string = '';
    email: string = '';
    phone: string = '';
    loading = signal(false);
    profile = signal(null);
 
    private authService: AuthService;
    private _snackBar = inject(MatSnackBar);
    messageStatus: MessageStatus = MessageStatus.Info;
 
    constructor(auth : AuthService){
      this.authService = auth;
      this.filteredCountries = this.options.slice();
 
      if(this.router.url.includes('state')) {
        this.loading.set(true);
      }
 
      this.authService.getCountriesJson().subscribe((response) => { 
        this.options = JSON.parse(response.body);
      });
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

class EmailMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

