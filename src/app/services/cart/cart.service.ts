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

  // we keep the existing BehaviorSubjects
  private quantitySubject = new BehaviorSubject<number>(1);
  quantity$ = this.quantitySubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  //add a new BehaviorSubject for the cart items
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) { }

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

  getCartItems(): CartItem[] {
    const items = localStorage.getItem(this.cartItemsKey);
    return items ? JSON.parse(items) as CartItem[] : [];
  }

  // update the cart
  updateCartItems(updatedItem: CartItem) {
    const items = this.getCartItems();
    const changedItem = items.find(item => item.productId === updatedItem.productId);

    if (!changedItem) return;

    changedItem.orderQty = updatedItem.orderQty;
    changedItem.lineTotal = changedItem.unitPrice * updatedItem.orderQty * (1 - changedItem.unitPriceDiscount);

    updatedItem.lineTotal = changedItem.lineTotal;

    this.cartItemsSubject.next(items);
    // update the total
    const newTotal = items.reduce((sum, item) =>
      sum + (item.unitPrice * item.orderQty * (1 - item.unitPriceDiscount)), 0
    );
    this.setTotal(newTotal);

    localStorage.setItem(this.cartItemsKey, JSON.stringify(items));
  }

  removeFromCart(productId: number | undefined) {
    if(!productId){
      return;
    }

    const cartItems = this.getCartItems();

    const indexToDelete = cartItems.findIndex(item => item.productId === productId);
    cartItems.splice(indexToDelete, 1);
    localStorage.setItem(this.cartItemsKey, JSON.stringify(cartItems));
  }

  // Get the current cart items
  getCurrentCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addProductToCart(productDetails: ProductCart) {
    const cartItems = this.getCartItems();
    const existingItem = cartItems.find(item => item.productId === productDetails.productId);

    if (existingItem) {
      // if the product exists in the cart, update the quantity
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