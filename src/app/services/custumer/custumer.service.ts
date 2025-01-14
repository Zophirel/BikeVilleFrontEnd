import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export class UserAddress {
  id?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  state?: string;
  postalCode?: string;

  constructor(id: string, address1: string, address2: string, city: string, country: string, state: string, postalCode: string) {
    this.id = id;
    this.addressLine1 = address1;
    this.addressLine2 = address2;
    this.city = city;
    this.country = country;
    this.state = state;
    this.postalCode = postalCode;
  }
}

export class UserData {
  id?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  state?: string;
  postalCode?: string;

  constructor(id: string, address1: string, address2: string, city: string, country: string, state: string, postalCode: string) {
    this.id = id;
    this.addressLine1 = address1;
    this.addressLine2 = address2;
    this.city = city;
    this.country = country;
    this.state = state;
    this.postalCode = postalCode;
  }
}



@Injectable({
  providedIn: 'root'
})

export class UserDataService {
  private http = inject(HttpClient);
  private customerUrl = "https://zophirel.it/api/Customer"; 
  private addressCustomerUrl = `${environment.BASE_URL}/api/CustomerAddress`; 
  private addressUrl = `${environment.BASE_URL}/api/Address`;

  getUserData(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    console.log("MAYBE");
    
    return this.http.get(`${this.customerUrl}/29485`, { headers });
  }

  getUserAddress(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  
    return this.http.get(`${this.addressCustomerUrl}/29485`,{ headers });
  }

  getAddress(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
      
    return this.http.get(`${this.addressUrl}/${id}`, { headers });
  }
  
  updateUserData(userData: UserAddress, userId: string): Observable<any> {
    const headers = new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${this.getToken()}`
         });
    const url = `${this.customerUrl}/${userId}`; 
    return this.http.patch(url, userData,  { headers }); // Effettua la chiamata PATCH
  }

  updateUserAddress(userData: UserAddress, userId: string): Observable<any> {
    const headers = new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${this.getToken()}`
         });
    const url = `${this.customerUrl}/${userId}`; 
    return this.http.patch(url, userData,  { headers }); // Effettua la chiamata PATCH
  }

  private getToken(): string | null {
    const tokens = localStorage.getItem('auth');
    if (tokens) {
      const auth = JSON.parse(tokens);
      return auth[0];
    }
    return null;
  }
}