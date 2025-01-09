import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignUpData } from './models/sign-up-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth : string | null = null;
  client: HttpClient;
  
  constructor(client: HttpClient) {
    this.client = client;
    
  }

  login(email: string, password: string) : Observable<any> {

    let body = { 
      email: email,
      password: password
    }
 
    const headers = { 'content-type': 'application/json' }    
   
    return this.client.post('https://zophirel.it/api/auth/login', body, {
      responseType: 'text', headers: headers, observe: 'response'
    });  
  }

  signUp(data : SignUpData) : Observable<any> {
    const headers = { 'content-type': 'application/json' }    
    return this.client.post('https://zophirel.it/api/auth/signup', data, {
      responseType: 'text', headers: headers, observe: 'response'
    });
  }


  authWithGoogle(idToken: string) : Observable<any> {
    const headers = { 'content-type': 'application/json' }    
    const body = JSON.stringify({ oauthIdToken: idToken }); // Explicitly stringify the JSON payload

    return this.client.post('https://zophirel.it/api/auth/google', body, {
      headers: headers,
      responseType: 'text',
      observe: 'response',
    });
  }


  checkAuth() : Observable<any> {
    const headers = { 'Authorization': 'Basic ' + this.auth }
    return this.client.get('https://zophirel.it/api/auth/test', {
      responseType: 'text', headers: headers, observe: 'response', 
    });
  }

  getCountriesJson() : Observable<any> {
    return this.client.get('https://bikeville.s3.cubbit.eu/jsonstatic/countries.json', {
      responseType: 'text', observe: 'response'
    });
  }  
}
