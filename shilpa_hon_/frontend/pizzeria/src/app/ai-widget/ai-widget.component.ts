import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AiOrderService, AiOrderResponse } from '../ai-order.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { AiOrderBaseComponent } from '../ai-order-base';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  response?: AiOrderResponse;
}

/**
 * Global floating AI Pizza Assistant. Mounted once in the app root (not a routed page
 * or navbar tab) so it's reachable as a chat-style widget from anywhere in the app,
 * with optional voice input via the browser's native Web Speech API. Uses the exact
 * same shared backend AI pipeline (Gemini -> fallback -> MongoDB validation -> pricing)
 * and the exact same ShoppingCartService integration as the Smart Meal Builder page.
 */
@Component({
  selector: 'app-ai-widget',
  templateUrl: './ai-widget.component.html',
  styleUrls: ['./ai-widget.component.css']
})
export class AiWidgetComponent extends AiOrderBaseComponent implements OnDestroy {
  isOpen = false;
  messages: ChatMessage[] = [];
  isListening = false;
  voiceSupported = false;

  private recognition: any;

  constructor(aiOrderService: AiOrderService, cartService: ShoppingCartService, router: Router) {
    super(aiOrderService, cartService, router);
    this.setupSpeechRecognition();
  }

  private setupSpeechRecognition(): void {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      this.voiceSupported = false;
      return;
    }

    this.voiceSupported = true;
    this.recognition = new SpeechRecognitionCtor();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.userText = this.userText ? `${this.userText} ${transcript}`.trim() : transcript;
    };
    this.recognition.onend = () => { this.isListening = false; };
    this.recognition.onerror = () => { this.isListening = false; };
  }

  toggleWidget(): void {
    this.isOpen = !this.isOpen;
  }

  toggleVoice(): void {
    if (!this.voiceSupported || !this.recognition) return;
    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      this.isListening = true;
      this.recognition.start();
    }
  }

  override submit(): void {
    const text = this.userText.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ role: 'user', text });
    this.userText = '';
    this.isLoading = true;
    this.errorMessage = '';

    this.aiOrderService.parseOrder(text).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.response = res;
        this.messages.push({ role: 'assistant', text: res.message, response: res });
        if (res.anyAdded && res.cartItems?.length) {
          res.cartItems.forEach(item => this.cartService.addOrIncrementCart(item));
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorText = 'Something went wrong reaching the assistant. Please try again.';
        this.errorMessage = errorText;
        this.messages.push({ role: 'assistant', text: errorText });
        console.error('AI order request failed', err);
      }
    });
  }

  override goToCart(): void {
    this.isOpen = false;
    super.goToCart();
  }

  override startOver(): void {
    this.messages = [];
    super.startOver();
  }

  ngOnDestroy(): void {
    if (this.recognition) {
      this.recognition.onresult = null;
      this.recognition.onend = null;
      this.recognition.onerror = null;
    }
  }
}
