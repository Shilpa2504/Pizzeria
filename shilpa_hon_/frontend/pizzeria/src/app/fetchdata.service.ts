import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pizza {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  rating?: number;
  reviews?: Review[];
  size?: string;
  vegetarian?: boolean;
  type?: string;
}

export interface Ingredient {
  _id?: string;
  name?: string;
  tname?: string;
  price: number;
  category?: string;
  image?: string;
}

export interface Review {
  _id?: string;
  userId: string;
  pizzaId: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: Address[];
  createdAt?: Date;
}

export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface Order {
  _id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  deliveryAddress?: Address;
  paymentMethod?: string;
  discount?: number;
  couponCode?: string;
  createdAt?: Date;
  estimatedDelivery?: Date;
}

export interface OrderItem {
  pizzaId: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class FetchdataService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  fetchOrderPizza(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(`${this.apiUrl}/pizzas`);
  }

  fetchBuildPizza(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.apiUrl}/ingredients`);
  }

  signup(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  updateUserProfile(userId: string, userData: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, userData);
  }

  getUserAddresses(userId: string): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/users/${userId}/addresses`);
  }

  addUserAddress(userId: string, address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.apiUrl}/users/${userId}/addresses`, address);
  }

  deleteUserAddress(userId: string, addressId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}/addresses/${addressId}`);
  }

  saveOrder(orderData: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-order`, orderData);
  }

  getOrderHistory(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/user/${userId}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/status`, { status });
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats`);
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/${orderId}/cancel`, {});
  }
}
