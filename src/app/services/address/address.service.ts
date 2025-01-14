import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderShipping } from '../../models/order-shipping.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrlAddress = `${environment.BASE_URL}/api/Address`;

  constructor(private http: HttpClient) { }

  // Nuovi metodi per le operazioni CRUD
  getAddress(orderId: string): Observable<OrderShipping> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const orderHeaderByCustomerUrl = `${this.apiUrlAddress}/${orderId}`; // get details di un customer a caso
    
    return this.http.get<OrderShipping>(orderHeaderByCustomerUrl, { headers });
  }
}