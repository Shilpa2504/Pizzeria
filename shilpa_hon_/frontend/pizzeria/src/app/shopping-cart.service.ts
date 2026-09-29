import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  type: 'preset' | 'custom';
}

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  private readonly _cartSource = new BehaviorSubject<CartItem[]>([]);
  currentMessage$ = this._cartSource.asObservable();
  private cartItems: CartItem[] = [];

  constructor() { this.loadCart(); }

  getCart(): CartItem[] { return this.cartItems; }
  getCart$(): Observable<CartItem[]> { return this.currentMessage$; }
  getCartCount(): number { return this.cartItems.reduce((count, item) => count + item.quantity, 0); }
  getCartTotal(): number { return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0); }

  addToCart(item: CartItem): void {
    const existing = this.cartItems.find(i => i.id === item.id);
    if (!existing) {
      this.cartItems.push({ ...item });
    }
    this.updateMessage(this.cartItems);
  }

  /**
   * Adds an item to the cart, merging its quantity into an existing line item with the
   * same id instead of no-op'ing like addToCart(). Used by the AI ordering flow, where a
   * validated item (e.g. the same pizza+toppings combo) may already be in the cart.
   */
  addOrIncrementCart(item: CartItem): void {
    const existing = this.cartItems.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cartItems.push({ ...item });
    }
    this.updateMessage(this.cartItems);
  }

  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateMessage(this.cartItems);
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        this.updateMessage(this.cartItems);
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateMessage([]);
  }

  updateMessage(newMessage: CartItem[]): void {
    this.cartItems = newMessage;
    this._cartSource.next(newMessage);
    this.saveCart();
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private loadCart(): void {
    try {
      const saved = localStorage.getItem('cart');
      this.cartItems = saved ? JSON.parse(saved) : [];
      this._cartSource.next(this.cartItems);
    } catch (e) {
      this.cartItems = [];
    }
  }
}
