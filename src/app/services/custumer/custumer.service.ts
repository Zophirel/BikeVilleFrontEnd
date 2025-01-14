import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserUpdateData {
  title?: string;
  name?: string;
  middle?: string;
  surname?: string;
  email?: string;
  phone?: string;
  company?: string;
}

export interface UserUpdateAddress {
  addressLine1?: string;
  addressLine2?: string; 
  city?: string;
  country?: string;
  state?: string;
  postalCode?: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserDataService {
  private http = inject(HttpClient);
  // private customerUrl = 'https://zophirel.it/api/Customer'; 
  private customerUrl = "https://zophirel.it/api/Customer"; 
  private addressUrl = 'https://zophirel.it/api/Address'; 

  getUserData(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    console.log("MAYBE");
    return this.http.get(`${this.customerUrl}/${userId}`, { headers });
  }

  updateUserData(userData: UserUpdateData, userId: string): Observable<any> {
    const headers = new HttpHeaders({
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${this.getToken()}`
         });
    const url = `${this.customerUrl}/${userId}`; 
    return this.http.patch(url, userData,  { headers }); // Effettua la chiamata PATCH
  }

  getUserAddress(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    console.log("eccoci");
    //return this.http.get(`${this.addressUrl}/${userId}`,{ headers });
    return this.http.get(`${this.addressUrl}/29485`,{ headers });
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