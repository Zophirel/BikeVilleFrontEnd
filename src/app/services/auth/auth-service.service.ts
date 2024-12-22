import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth : string | null = null;
  private clientId = '921059556192-2brjfar3rbda76hnb54k7djojj4ccdg7.apps.googleusercontent.com';
  client: HttpClient;
  
  constructor(client: HttpClient) {
    this.client = client;
  }

  public initializeGoogleSignIn(callback: (response: any) => void): void {
    (window as any).google.accounts.id.initialize({
      client_id: this.clientId,
      callback: callback,
    });

    (window as any).google.accounts.id.renderButton(
      document.getElementById('google-button'),
      { theme: 'outline', size: 'large' }
    );
  }

  public promptGoogleOneTap(): void {
    (window as any).google.accounts.id.prompt();
  }

  login(email: string, password: string) : Observable<any> {

    let body = { 
      email: email,
      password: password
    }
 
    const headers = { 'content-type': 'application/json' }    
   
    return this.client.post('https://localhost:5078/api/auth/login', body, {
      responseType: 'text', headers: headers, observe: 'response'
    });

    
  }

  checkAuth() : Observable<any> {
    const headers = { 'Authorization': 'Basic ' + this.auth }
    return this.client.get('https://localhost:5078/api/auth/test', {
      responseType: 'text', headers: headers, observe: 'response', 
    });
  }

  getCountriesJson() : Observable<any> {
    return this.client.get('https://bikeville.s3.cubbit.eu/jsonstatic%2Fcountries.json', {
      responseType: 'text', observe: 'response'
    });
  }
}
