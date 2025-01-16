import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
//import {Guid} from 'guid-typescript'; // npm i guid-typescript --save

export class Address {

  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  countryRegion?: string;
  postalCode?: string;
  rowguid: string;
  modifiedDate: Date;


  constructor(address1: string, address2: string, city: string,state: string, country: string,  postalCode: string, rowguid: string, date: Date) {
    this.addressLine1 = address1;
    this.addressLine2 = address2;
    this.city = city;
    this.stateProvince = state;
    this.countryRegion = country;
    this.postalCode = postalCode;
    this.rowguid = rowguid;
    this.modifiedDate = date;
  }
}

export class UserData {

  customerId: number;
  title: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  emailAddress?: string;
  phone?: string;
  companyName?: string;
  salesPerson: string;
  passwordHash: string;
  passwordSalt: string;
  rowGuid: string;
  migratedCustomer: boolean;
  signedWithGoogle: boolean;
  isAdmin: boolean;
  emailVerified: boolean;

  constructor(id: number, title: string, name: string, middle: string, surname: string, email: string, phone: string, company: string,
    sales: string, hash: string, salt: string, guid: string, migrated: boolean, google: boolean, admin: boolean, verified: boolean) {
    this.customerId = id;
    this.title = title;
    this.firstName = name;
    this.middleName = middle;
    this.lastName = surname;
    this.emailAddress = email;
    this.phone = phone;
    this.companyName = company;
    this.salesPerson = sales;
    this.passwordHash = hash;
    this.passwordSalt = salt;
    this.rowGuid = guid;
    this.migratedCustomer = migrated;
    this.signedWithGoogle = google;
    this.isAdmin = admin;
    this.emailVerified = verified;
  }
}

export class UserAddress {
  customerId: number;
  addressId: number;
  addressType: string;
  rowguid: string;
  modifiedDate: Date;

  constructor(cId: number, aId: number, type: string, rowguid: string, date: Date) {
    this.customerId = cId;
    this.addressId = aId;
    this.addressType = type;
    this.rowguid = rowguid;
    this.modifiedDate = date;
  }
}

@Injectable({
  providedIn: 'root'
})

export class UserDataService {
  private http = inject(HttpClient);
  private customerUrl = `${environment.BASE_URL}/api/Customer`;
  private addressCustomerUrl = `${environment.BASE_URL}/api/CustomerAddress`;
  private addressUrl = `${environment.BASE_URL}/api/Address`;
  addressId: any;

  //GET
  getUserData(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    console.log("MAYBE");
    
    return this.http.get(`${this.customerUrl}/ ${userId}`, { headers });
  }

  getUserAddress(userId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  
    return this.http.get(`${this.addressCustomerUrl}/${userId}`,{ headers });
  }

  getAddress(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get(`${this.addressUrl}/${id}`, { headers });
  }

  getAddressByGuid(guid: string): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
    });
    console.log("GUID: " + guid);
    return this.http.get<Address>(`${this.addressUrl}/byguid/${guid}`, {headers});
  }

  //UPDATE
  updateUserData(userData: UserData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    console.log('Sending userData:', JSON.stringify(userData, null, 2));
    const url = `${this.customerUrl}/${userData.customerId}`;
    return this.http.put<UserData>(url, userData, { headers }); // Effettua la chiamata 
  }

  updateUserAddress(userData: Address, userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    const url = `${this.customerUrl}/${userId}`;
    return this.http.put(url, userData, { headers });
  }


  //INSERT
  insertAddress(userData: Address): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    console.log('Sending userData:', JSON.stringify(userData, null, 2));
    const url = `${this.addressUrl}`;
    return this.http.post(url, userData, { headers });
  }

  insertUserAddress(userAddress: UserAddress): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    console.log('Sending userData:', JSON.stringify(userAddress, null, 2));
    const url = `${this.addressCustomerUrl}`;
    return this.http.post(url, userAddress, { headers });
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