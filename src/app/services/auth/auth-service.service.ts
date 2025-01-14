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

  getAccessToken(){
    let tokens = localStorage.getItem('auth');
    if(tokens){
      let auth = JSON.parse(tokens);
      return auth[1];
    } 
  }

  getIdToken(){
    let tokens = localStorage.getItem('auth');
    if(tokens){
      let auth = JSON.parse(tokens);
      return auth[0];
    } 
  }

  getTokenData(token: string){
    try {
      if(!token.includes('.')){
        token = atob(token);
      }

      let data = token.split('.')[1];
      let decodedData = atob(data);
      return JSON.parse(decodedData);
    } catch (error) {
      return null;
    } 
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

  validateEmail(token: string) : Observable<any> {
    const headers = { 
      'content-type': 'application/json',
      "Authorization": "Bearer " + atob(token)
    } 
    
    return this.client.post('https://zophirel.it/api/auth/emailvalidation', null, {
      headers: headers,
      responseType: 'text',
      observe: 'response',
    });
  }

  changePassword(token: string, password: string) : Observable<any> {
    const headers = { 
      'content-type': 'application/json',
      "Authorization": "Bearer " + token
    }    
    return this.client.post('https://zophirel.it/api/auth/reset', {password: password}, {
      headers: headers,
      responseType: 'text',
      observe: 'response',
    });
  }

  migrateUser(token: string, password: string) : Observable<any> {
    const headers = { 
      'content-type': 'application/json',
      "Authorization": "Bearer " + token
    }    
    return this.client.post('https://zophirel.it/api/auth/migrate', {password: password}, {
      headers: headers,
      responseType: 'text',
      observe: 'response',
    });
  }

  getCountriesJson() : Observable<any> {
    return this.client.get('https://bikeville.s3.cubbit.eu/jsonstatic/countries.json', {
      responseType: 'text', observe: 'response'
    });
  }  
}
