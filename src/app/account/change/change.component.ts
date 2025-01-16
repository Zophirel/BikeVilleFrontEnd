import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
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
import { NewAddress, UserDataService } from '../../services/custumer/custumer.service';
import { Address } from '../../services/custumer/custumer.service';
import { UserData } from '../../services/custumer/custumer.service';
import { UserAddress } from '../../services/custumer/custumer.service';

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
  userAddress: any[] = []; // contiene il risultato get USER - ADDRESS
  addressFinal: any; // contiene il risultato get ADDRESS

  addressClass!: Address; // classe con i dati dell'indirizzo 
  addressOldClass!: NewAddress; // classe con i dati dell'inserimento di un nuovo indirizzo
  userClass!: UserData; //classe con i dati del user
  userAddressClass!: UserAddress;  // classe con indirizzo - utente


  addressId: number = 0;
  addressType: string = "";
  flagAddress: boolean = true;


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
      addressType: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required]
    });

    if (this.router.url.includes('state')) {
      this.loading.set(true);
    }

    this.authService.getCountriesJson().subscribe((response) => {
      this.options = JSON.parse(response.body);
    });
  }

  getIdToken() {
    let tokens = localStorage.getItem('auth');
    if (tokens) {
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
      title: this.userClass.title || '',
      name: this.userClass.firstName || '',
      middle: this.userClass.middleName || '',
      surname: this.userClass.lastName || '',
      email: this.userClass.emailAddress || '',
      phone: this.userClass.phone || '',
      company: this.userClass.companyName || ''
    });
  }

  initializeFormAddress() {
    this.changeForm.patchValue({
      addressLine1: this.addressClass.addressLine1 || '',
      addressLine2: this.addressClass.addressLine2 || null,
      city: this.addressClass.city || '',
      state: this.addressClass.stateProvince || '',
      country: this.addressClass.countryRegion || '',
      postalCode: this.addressClass.postalCode || ''
    });

    if (this.changeForm.get('country')?.value) {
      const countryData = this.options.find(c => c.name === this.changeForm.get('country')?.value);
      if (countryData) {
        this.setStateProvince(countryData.code);
      }
    }
  }

  initializeFormAddressType() {
    this.changeForm.patchValue({
      addressType: this.userAddressClass.addressType || '',
    });
  }
  // function to autocomplete the form with the given data
  ngOnInit(): void {
    const token = this.getIdToken();
    if (token) {
      this.data = this.getTokenData(token);

      this.userDataService.getUserData(this.data.nameid).subscribe({
        next: (response) => {
          const u = response;
          console.log(response);
          this.userClass = new UserData(u.customerId, u.title, u.firstName, u.middleName, u.lastName, u.emailAddress, u.phone, u.companyName, u.salesPerson,
            u.passwordHash, u.passwordSalt, u.rowguid, u.migratedCustomer, u.signedWithGoogle, u.isAdmin, u.emailVerified);
          this.initializeFormData();
        },
        error: (error) => {
          let errorMessage = 'An error occurred in getUserData';
          console.log(errorMessage);
          console.log(error);

          if (error.error?.message) {
            errorMessage = error.error.message;
          }
        }
      });

      this.userDataService.getUserAddress(this.data.nameid).subscribe({
        next: (response) => {
          if (response.length == 0) {
            this.flagAddress = false;
            return console.log("nada indirizzo parte 2");
          }
          const a = response;
          console.log(response);
          this.userAddressClass = new UserAddress(a[0].customerId, a[0].addressId, a[0].addressType, a[0].rowguid, a[0].modifiedDate);
          this.initializeFormAddressType();

          this.userDataService.getAddress(this.userAddressClass.addressId).subscribe({
            next: (response) => {
              const r = response;
              this.addressClass = new Address(r.addressId, r.addressLine1, r.addressLine2, r.city, r.stateProvince, r.countryRegion, r.postalCode, r.rowguid, r.modifiedDate);
              this.addressId = r.addressId;
              this.initializeFormAddress();
            },
            error: (error) => {
              let errorMessage = 'An error occurred in getAddress';
              console.log(errorMessage);
              console.log(error);

              if (error.error?.message) {
                errorMessage = error.error.message;
              }
            }
          });

        },
        error: (error) => {
          let errorMessage = 'An error occurred in 164';
          console.log(error);

          if (error.error?.message) {
            errorMessage = error.error.message;
          }
        }
      });
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
        if (a[1] < b[1]) { return -1; }
        if (a[1] > b[1]) { return 1; }
        return 0;
      });

      this.filteredState.set(entries);
    }
  }

  // function to set the country
  filterCountry(): void {
    if (!this.inputCountry) return;

    if (this.inputState && this.inputState.nativeElement.value != "") {
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

  // changeAccount() {
  //   this.router.navigateByUrl('/account');
  // }

  saveChanges() {

    if (this.changeForm.valid) {

      // update customer
      const userData = new UserData(
        this.userClass.customerId,
        this.changeForm.get('title')?.value,
        this.changeForm.get('name')?.value,
        this.changeForm.get('middle')?.value,
        this.changeForm.get('surname')?.value,
        this.changeForm.get('email')?.value,
        this.changeForm.get('phone')?.value,
        this.changeForm.get('company')?.value,
        this.userClass.salesPerson,
        this.userClass.passwordHash,
        this.userClass.passwordSalt,
        this.userClass.rowGuid,
        this.userClass.migratedCustomer,
        this.userClass.signedWithGoogle,
        this.userClass.isAdmin,
        this.userClass.emailVerified
      );

      this.userDataService.updateUserData(userData).subscribe({
        next: (response) => {
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


      if (this.flagAddress) {// true, indirizzo esiste già - faccio solo una put per aggiornarlo

        const address = new Address(
          this.addressClass.addressId,
          this.changeForm.get('addressLine1')?.value,
          this.changeForm.get('addressLine2')?.value,
          this.changeForm.get('city')?.value,
          this.changeForm.get('state')?.value,
          this.changeForm.get('country')?.value,
          this.changeForm.get('postalCode')?.value,
          crypto.randomUUID(), // !!! non va modificato poi nel backend
          new Date,
        );

        const userAddress = new UserAddress (
          userData.customerId,
          address.addressId,
          this.changeForm.get('addressType')?.value,
          crypto.randomUUID(), // !!! non va modificato poi nel backend
          new Date,
          // address,
          // userData,
        );
        
        this.userDataService.updateAddress(address, userAddress.addressId).subscribe({
          next: (response) => {
          }, 
          error: (error) => {
            console.log('Sending userData:', JSON.stringify(error, null, 2));
            console.error();
          }
        });

        this.userDataService.updateUserAddress(userAddress, userAddress.customerId, userAddress.addressId).subscribe({
          next: (response) => {
          }, 
          error: (error) => {
            console.log('Sending userData:', JSON.stringify(error, null, 2));
            console.error();
          }
        });
      }
      else {
        // false, indirizzo non esiste - devo fare una post
        const newAddress = new NewAddress(
          this.changeForm.get('addressLine1')?.value,
          this.changeForm.get('addressLine2')?.value,
          this.changeForm.get('city')?.value,
          this.changeForm.get('state')?.value,
          this.changeForm.get('country')?.value,
          this.changeForm.get('postalCode')?.value,
          crypto.randomUUID(),
          new Date,
        );
        this.userDataService.insertAddress(newAddress).subscribe({
          next: (response) => {
            this.userDataService.getAddressByGuid(newAddress.rowguid).subscribe({
              next: (response) => {
                this.addressId = response.addressId;
                console.log(this.addressId);
                const address = new Address(response.addressId, newAddress.addressLine1, newAddress.addressLine2, newAddress.city, newAddress.stateProvince,
                  newAddress.countryRegion, newAddress.postalCode, newAddress.rowguid, newAddress.modifiedDate);
                  console.log('See RESPONSE: ', JSON.stringify(response, null, 2));
                const userAddress = new UserAddress(
                  userData.customerId,
                  this.addressId,
                  this.changeForm.get('addressType')?.value,
                  crypto.randomUUID(),
                  new Date,
                  // address,
                  // userData,
                )
                this.userDataService.insertUserAddress(userAddress).subscribe({
                  next: (response) => {
                    console.log(response);
                  },
                  error: (error) => {
                    console.log("no " + error);
                    console.log('Sending userData:', JSON.stringify(error, null, 2));
                    console.error();
                  }
                });
              },
              error: (error) => {
                console.log("SAAAAD222223");
                let errorMessage = 'An error occurred while inserting your address';
                console.log(error);
                if (error.error?.message) {
                  errorMessage = error.error.message;
                }
              }
            });
          },
          error: (error) => {
            console.log("SAAAAD");
            let errorMessage = 'An error occurred while inserting your address';
            console.log(error);
            if (error.error?.message) {
              errorMessage = error.error.message;
            }
          }
        });
      }
    }
    else {
      // Marca tutti i campi come touched per mostrare gli errori
      console.log("maleee");
      Object.keys(this.changeForm.controls).forEach(key => {
        const control = this.changeForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });

      this._snackBar.open('Please fill in all required fields correctly', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });
    }
    this.router.navigateByUrl('/account');
  }

}

class Country {
  constructor(public name: string, public code: string) { }
}

