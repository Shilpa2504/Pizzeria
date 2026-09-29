import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CartItem } from './shopping-cart.service';

export interface AiAvailableItem {
  name: string;
  quantity: number;
  price: number;
  toppings: Array<{ name: string; price: number; quantity: number }>;
}

export interface AiUnavailableItem {
  name: string;
  category: 'pizza' | 'topping' | 'item';
  reason: string;
  suggestions?: string[];
}

export interface AiOrderResponse {
  success: boolean;
  usedFallback?: boolean;
  aiError?: string;
  intent?: string;
  availableItems: AiAvailableItem[];
  unavailableItems: AiUnavailableItem[];
  cartItems: CartItem[];
  total: number;
  anyAdded: boolean;
  message: string;
}

/**
 * Talks to the shared backend AI ordering endpoint. This is the single pipeline used by
 * BOTH the AI Pizza Assistant and the Smart Meal Builder: the user's raw natural-language
 * text is sent as-is, and the backend (Gemini + MongoDB validation) returns cart-ready,
 * authoritatively-priced items. The Gemini API key never reaches the browser.
 */
@Injectable({ providedIn: 'root' })
export class AiOrderService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  parseOrder(text: string): Observable<AiOrderResponse> {
    return this.http.post<AiOrderResponse>(`${this.apiUrl}/api/ai/order`, { text });
  }
}
