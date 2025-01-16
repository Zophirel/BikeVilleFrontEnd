import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { ProductCart } from '../../models/product-cart.model';
import { CartItem } from '../../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsKey = 'cartItems';

  // Manteniamo i BehaviorSubject esistenti
  private quantitySubject = new BehaviorSubject<number>(1);
  quantity$ = this.quantitySubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  // Aggiungiamo un nuovo BehaviorSubject per gli items del carrello
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Metodi esistenti
  setQuantity(quantity: number) {
    this.quantitySubject.next(quantity);
  }

  getQuantity() {
    return this.quantitySubject.value;
  }

  setCartItems(items: CartItem[]) {
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

  // Nuovi metodi per le operazioni CRUD
  getCartItems(): CartItem[] {
    const items = localStorage.getItem(this.cartItemsKey);
    return items ? JSON.parse(items) as CartItem[] : [];
  }

  // Aggiorna il carrello locale
  updateCartItems(updatedItem: CartItem) {
    const items = this.getCartItems();
    const changedItem = items.find(item => item.productId === updatedItem.productId);

    if (!changedItem) return;

    changedItem.orderQty = updatedItem.orderQty;
    changedItem.lineTotal = changedItem.unitPrice * updatedItem.orderQty * (1 - changedItem.unitPriceDiscount);

    // for live update
    updatedItem.lineTotal = changedItem.lineTotal;

    this.cartItemsSubject.next(items);
    // Aggiorna anche il totale
    const newTotal = items.reduce((sum, item) =>
      sum + (item.unitPrice * item.orderQty * (1 - item.unitPriceDiscount)), 0
    );
    this.setTotal(newTotal);

    localStorage.setItem(this.cartItemsKey, JSON.stringify(items));
  }

  // Rimuovi un item dal carrello utilizzando salesOrderId e salesOrderDetailId
  removeFromCart(productId: number | undefined) {
    if(!productId){
      return;
    }

    const cartItems = this.getCartItems();

    const indexToDelete = cartItems.findIndex(item => item.productId === productId);
    cartItems.splice(indexToDelete, 1);
    localStorage.setItem(this.cartItemsKey, JSON.stringify(cartItems));
  }

  // Ottieni gli items correnti del carrello
  getCurrentCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addProductToCart(productDetails: ProductCart) {
    const cartItems = this.getCartItems();
    const existingItem = cartItems.find(item => item.productId === productDetails.productId);

    if (existingItem) {
      // se il prodotto esiste nel carrello, aggiorna la quantità
      existingItem.orderQty += 1;
      existingItem.lineTotal = existingItem.unitPrice * existingItem.orderQty * (1 - existingItem.unitPriceDiscount);
    } else {
      cartItems.push(this.createProduct(productDetails))
    }

    localStorage.setItem(this.cartItemsKey, JSON.stringify(cartItems));
  }

  createProduct(productDetails: ProductCart) : CartItem{
    return {
      productId: productDetails.productId,
      orderQty: 1,
      unitPrice: productDetails.price,
      unitPriceDiscount: 0,
      lineTotal: productDetails.price,
    };
  }

  clearCart() {
    localStorage.removeItem('cartItems'); // Remove cart items from local storage
  }
}