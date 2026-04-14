import { Component, OnInit } from '@angular/core';
import { ShoppingCartService, CartItem } from '../shopping-cart.service';
import { FetchdataService } from '../fetchdata.service';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.css']
})
export class ShoppingcartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  tax = 0;
  deliveryFee = 50;
  total = 0;
  isPlacingOrder = false;

  constructor(
    private readonly cartService: ShoppingCartService,
    private readonly fd: FetchdataService,
    private readonly sessionService: SessionService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.getCart$().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.tax = Math.round(this.subtotal * 0.05);
    this.total = this.subtotal + this.tax + (this.cartItems.length > 0 ? this.deliveryFee : 0);
  }

  increment(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decrement(item: CartItem): void {
    if (item.quantity <= 1) {
      this.cartService.removeFromCart(item.id);
    } else {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  placeOrder(): void {
    const user = this.sessionService.getCurrentUserSync();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.isPlacingOrder = true;
    const orderData = {
      userId: user._id || user.email,
      items: this.cartItems.map(item => ({
        pizzaId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: this.total,
      status: 'pending',
      paymentMethod: 'COD'
    };

    const finalTotal = this.total;
    this.fd.saveOrder(orderData as any).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/order-success'], { queryParams: { cost: finalTotal } });
      },
      error: (err) => {
        console.error('Order failed', err);
        alert('Failed to place order. Please try again.');
        this.isPlacingOrder = false;
      }
    });
  }
}
