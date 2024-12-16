import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private quantitySubject = new BehaviorSubject<number>(1);
  quantity$ = this.quantitySubject.asObservable();
  
  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  setQuantity(quantity: number) {
    this.quantitySubject.next(quantity);
  }

  getQuantity() {
    return this.quantitySubject.value;
  }
  
  setTotal(total: number) {
    this.totalSubject.next(total);
  }

  getTotal() {
    return this.totalSubject.value;
  }
}
