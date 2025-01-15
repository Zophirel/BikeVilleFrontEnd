import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { SalesOrderDetail } from '../../models/sales-order-detail.model';
import { SalesOrderHeader } from '../../models/sales-order-header.model';
import { environment } from '../../../environments/environment';
import { ProductCart } from '../../models/product-cart.model';

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

  getNumberOfItems() {
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

  getHeaders(): HttpHeaders{
    const token = localStorage.getItem('auth');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getOrderHeader(headers: HttpHeaders, customerId: string): Observable<SalesOrderHeader> {
    const orderHeaderByCustomerUrl = `${this.apiUrlSalesOrderHeader}/Customer/${customerId}`; // get details di un customer a caso
    return this.http.get<SalesOrderHeader>(orderHeaderByCustomerUrl, { headers });
  }

  // Nuovi metodi per le operazioni CRUD
  getCartItems(): Observable<SalesOrderDetail[]> {
    const headers = this.getHeaders();

    return this.getOrderHeader(headers, '30089').pipe(
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

    if (!changedItem) return;

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
    const headers = this.getHeaders();
    const url = `${this.apiUrlSalesOrderDetail}/${salesOrderId}/${salesOrderDetailId}`;
    return this.http.delete(url, { headers });
  }

  // Aggiorna la quantità di un item
  updateItemQuantity(salesOrderId: number, salesOrderDetailId: number, quantity: number): Observable<SalesOrderDetail> {
    const headers = this.getHeaders();

    const updatedItem = {
      orderQty: quantity,
    };

    return this.http.put<SalesOrderDetail>(`${this.apiUrlSalesOrderDetail}/${salesOrderId}/${salesOrderDetailId}`, updatedItem, { headers });
  }

  // Ottieni gli items correnti del carrello
  getCurrentCartItems(): SalesOrderDetail[] {
    return this.cartItemsSubject.value;
  }

  addProductToCart(productDetails: ProductCart): Observable<any> {
    const headers = this.getHeaders();

    return this.getCartItems().pipe(
      switchMap((cartItems) => {
        const existingItem = cartItems.find(item => item.productId === productDetails.productId);

        if (existingItem) {
          // se il prodotto esiste nel carrello, aggiorna la quantità
          existingItem.orderQty += 1;
          existingItem.lineTotal = existingItem.unitPrice * existingItem.orderQty * (1 - existingItem.unitPriceDiscount);

          return this.http.put<any>(`${this.apiUrlSalesOrderDetail}/${existingItem.salesOrderId}/${existingItem.salesOrderDetailId}`, existingItem, { headers });
        } else {
          return this.getOrderHeader(headers, '30089').pipe(
            switchMap((orderHeader) => {
              if(orderHeader){
                return this.postProduct(headers, productDetails, orderHeader.salesOrderId);
              }
              else{
                return this.http.post<any>(`${this.apiUrlSalesOrderHeader}`, {
                  salesOrderId: this.generateGuid() 
                }).pipe(
                  switchMap((newOrderHeader) => this.postProduct(headers, productDetails, newOrderHeader.id))
                );
              }
            })
          )
        }
      })
    );
  }

  postProduct(headers: HttpHeaders, productDetails: ProductCart, salesOrderId: string) : Observable<any>{
    const newItem = {
      productId: productDetails.productId,
      salesOrderId,
      orderQty: 1,
      lineTotal: productDetails.price,
      //rowguid: this.generateGuid(), // genera un GUID unico per l'item
      modifiedDate: new Date()
    };

    return this.http.post<any>(this.apiUrlSalesOrderDetail, newItem, { headers });
  }

  generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}