import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageStatus } from '../../auth/signup/Enums';
import { UserDataService } from '../../services/custumer/custumer.service';
 
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
export class ChangeComponent implements OnInit {
  @ViewChild('inputCountry') inputCountry: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('inputState') inputState: ElementRef<HTMLInputElement> | undefined;
  
  router = inject(Router);
  changeForm: FormGroup;
  
  options: Country[] = [];
  filteredCountries: Country[];
  filteredState = signal<[string, string][]>([]); 
  
  loading = signal(false);
  profile = signal(null);
  data: any;

  private authService: AuthService;
  private _snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  messageStatus: MessageStatus = MessageStatus.Info;

  constructor(auth: AuthService, private userDataService: UserDataService) {
    this.authService = auth;
    this.filteredCountries = this.options.slice();
    
    this.changeForm = this.fb.group({
      title: [''],
      name: ['', Validators.required],
      middle: [''],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      company: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required]
    });

    if(this.router.url.includes('state')) {
      this.loading.set(true);
    }

    this.authService.getCountriesJson().subscribe((response) => { 
      this.options = JSON.parse(response.body);
    });
  }

  getIdToken() {
    let tokens = localStorage.getItem('auth');
    if(tokens) {
      let auth = JSON.parse(tokens);
      return auth[0];
    } 
    return null;
  }

  getTokenData(token: string) {
    let data = token.split('.')[1];
    let decodedData = atob(data);
    return JSON.parse(decodedData);
  }

  initializeFormData() {     
    this.changeForm.patchValue({
      title: this.data.title || '',
      name: this.data.name || this.data.unique_name || '',
      middle: this.data.middle_name || '',
      surname: this.data.family_name || '',
      email: this.data.email || '',
      phone: this.data.Phone || '',
      company: this.data.Company || '',
      addressLine1: this.data.address_line1 || '',
      addressLine2: this.data.address_line2 || '',
      city: this.data.city || '',
      country: this.data.country || '',
      state: this.data.state || '',
      postalCode: this.data.postal_code || ''
    });

    if (this.changeForm.get('country')?.value) {
      const countryData = this.options.find(c => c.name === this.changeForm.get('country')?.value);
      if (countryData) {
        this.setStateProvince(countryData.code);
      }
    }
  }

  // function to autocomplete the form with the gived data
  ngOnInit(): void {
    const token = this.getIdToken();
    if (token) {
      this.data = this.getTokenData(token);
      this.initializeFormData();
    }
  }

  setStateProvince(country: string): void {
    const countries = countriesJson as Record<string, any>;
    const countryData = countries[country];
    if (countryData && countryData.divisions) {
      let entries = Object.entries<string>(countryData.divisions);
      
      entries = entries.filter(([key]) => {
        return Number.isNaN(parseInt(key.split("-")[1]));
      });

      entries.sort((a, b) => {
        if(a[1] < b[1]) { return -1; }
        if(a[1] > b[1]) { return 1; }
        return 0;
      });

      this.filteredState.set(entries);
    }
  }

  // function to set the country
  filterCountry(): void {
    if (!this.inputCountry) return;

    if(this.inputState && this.inputState.nativeElement.value != "") {
      this.inputState.nativeElement.value = "";
      this.changeForm.get('state')?.setValue("");
    }

    const filterValue = this.inputCountry.nativeElement.value.toLowerCase();
    this.filteredCountries = this.options.filter(o => 
      o.name.toLowerCase().includes(filterValue)
    );
  }

  filterStateProvince(): void {
    if (!this.inputState) return;
    
    const filterValue = this.inputState.nativeElement.value.toLowerCase();
    this.filteredState.set(
      this.filteredState().filter(o => 
        o[1].toLowerCase().includes(filterValue)
      )
    );
  }

  
  saveChanges() {
    console.log("ciao");
    //if (this.changeForm.valid) {
      console.log("ciao2");
      const userData = {
        title: this.changeForm.get('title')?.value,
        name: this.changeForm.get('name')?.value,
        middle: this.changeForm.get('middle')?.value,
        surname: this.changeForm.get('surname')?.value,
        email: this.changeForm.get('email')?.value,
        phone: this.changeForm.get('phone')?.value,
        company: this.changeForm.get('company')?.value,
      };
      console.log(userData);

      const userAddress = {
        addressLine1: this.changeForm.get('addressLine1')?.value,
        addressLine2: this.changeForm.get('addressLine2')?.value,
        city: this.changeForm.get('city')?.value,
        country: this.changeForm.get('country')?.value,
        state: this.changeForm.get('state')?.value,
        postalCode: this.changeForm.get('postalCode')?.value
      }

      // this.userDataService.updateUserData(userData, this.data.nameid).subscribe({
      //   next: (response) => {
      //     console.log("ok");
      //     this.loading.set(false);
      //     this._snackBar.open('Your data has been successfully updated', 'Close', {
      //       duration: 3000,
      //       horizontalPosition: 'end',
      //       verticalPosition: 'top',
      //       panelClass: ['success-snackbar']
      //     });
      //   },
      //   error: (error) => {
      //     this.loading.set(false);
      //     let errorMessage = 'An error occurred while updating your data';
      //     console.log(error);
      //     if (error.error?.message) {
      //       errorMessage = error.error.message;
      //     }
          
      //     this._snackBar.open(errorMessage, 'Close', {
      //       duration: 5000,
      //       horizontalPosition: 'end',
      //       verticalPosition: 'top',
      //       panelClass: ['error-snackbar']
      //     });
      //   }
      // });

      this.userDataService.getUserAddress(this.data.nameid).subscribe({
        next: (response) => {
          console.log("weeeeee");
          this._snackBar.open('Your data has been successfully updated', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          let errorMessage = 'An error occurred while updating your data';
          console.log(error);
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this._snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });


    //} 
    // else {
    //   // Marca tutti i campi come touched per mostrare gli errori
    //   console.log("maleee");
    //   Object.keys(this.changeForm.controls).forEach(key => {
    //     const control = this.changeForm.get(key);
    //     if (control) {
    //       control.markAsTouched();
    //     }
    //   });

      // this._snackBar.open('Please fill in all required fields correctly', 'Close', {
      //   duration: 5000,
      //   horizontalPosition: 'end',
      //   verticalPosition: 'top',
      //   panelClass: ['warning-snackbar']
      // });
    //}
    }

  // Aggiungi questo metodo per gestire il loading state nel template
  // saveInProgress(): boolean {
  //   console.log(this.loading);
  //   return this.loading();
  // }

}

class Country {
  constructor(public name: string, public code: string) {}
}