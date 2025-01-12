import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { SalesOrderDetail } from '../../models/sales-order-detail.model';
import { SalesOrderHeader } from '../../models/sales-order-header.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrlSalesOrderDetail = `${environment.BASE_URL}/api/SalesOrderDetail`;
  private apiUrlSalesOrderHeader = `${environment.BASE_URL}/api/SalesOrderHeader`;

  // Manteniamo i BehaviorSubject esistenti
  private quantitySubject = new BehaviorSubject<number>(1);
  quantity$ = this.quantitySubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  // Aggiungiamo un nuovo BehaviorSubject per gli items del carrello
  private cartItemsSubject = new BehaviorSubject<SalesOrderDetail[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  shipToAddressId: string | undefined;

  constructor(private http: HttpClient) { }

  // Metodi esistenti
  setQuantity(quantity: number) {
    this.quantitySubject.next(quantity);
  }

  getQuantity() {
    return this.quantitySubject.value;
  }

  setCartItems(items: SalesOrderDetail[]) {
    this.cartItemsSubject.next(items);
  }

  getNumberOfItems(){
    return this.cartItemsSubject.value.length;
  }

  setTotal(total: number) {
    this.totalSubject.next(total);
  }

  getTotal() {
    return this.totalSubject.value;
  }

  getShippingAddressId() {
    return this.shipToAddressId;
  }

  // Nuovi metodi per le operazioni CRUD
  getCartItems(): Observable<SalesOrderDetail[]> {
    const token = localStorage.getItem('auth');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const orderHeaderByCustomerUrl = `${this.apiUrlSalesOrderHeader}/Customer/30089`; // get details di un customer a caso
    
    return this.http.get<SalesOrderHeader>(orderHeaderByCustomerUrl, { headers }).pipe(
      // switchMap allows us to return a new observable (the second HTTP request)
      switchMap((orderHeader: SalesOrderHeader) => {
        this.shipToAddressId = orderHeader.shipToAddressId

        // Use some property from the orderHeader (e.g., orderHeader.id) in the second request
        const url = `${this.apiUrlSalesOrderDetail}/${orderHeader.salesOrderId}`;  // Assuming you need the orderHeader's id here
        return this.http.get<SalesOrderDetail[]>(url, { headers });
      })
    );
  }

  // Aggiorna il carrello locale
  updateCartItems(items: SalesOrderDetail[], updatedItem: SalesOrderDetail) {
    const changedItem = items.find(item => item.salesOrderId === updatedItem.salesOrderId && item.salesOrderDetailId === updatedItem.salesOrderDetailId);
    
    if(!changedItem) return;
 
    changedItem.orderQty = updatedItem.orderQty;
    changedItem.lineTotal = changedItem.unitPrice * updatedItem.orderQty * (1 - changedItem.unitPriceDiscount);

    this.cartItemsSubject.next(items);
    // Aggiorna anche il totale
    const newTotal = items.reduce((sum, item) =>
      sum + (item.unitPrice * item.orderQty * (1 - item.unitPriceDiscount)), 0
    );
    this.setTotal(newTotal);
  }

  // Rimuovi un item dal carrello utilizzando salesOrderId e salesOrderDetailId
  removeFromCart(salesOrderId: number, salesOrderDetailId: number): Observable<any> {
    const token = localStorage.getItem('auth');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrlSalesOrderDetail}/${salesOrderId}/${salesOrderDetailId}`;
    return this.http.delete(url, { headers });
  }

  // Aggiorna la quantità di un item
  updateItemQuantity(salesOrderId: number, salesOrderDetailId: number, quantity: number): Observable<SalesOrderDetail> {
    const token = localStorage.getItem('auth');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const updatedItem = {
      orderQty: quantity,
    };

    return this.http.put<SalesOrderDetail>(`${this.apiUrlSalesOrderDetail}/${salesOrderId}/${salesOrderDetailId}`, updatedItem, { headers });
  }

  // Ottieni gli items correnti del carrello
  getCurrentCartItems(): SalesOrderDetail[] {
    return this.cartItemsSubject.value;
  }
}