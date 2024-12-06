import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}
