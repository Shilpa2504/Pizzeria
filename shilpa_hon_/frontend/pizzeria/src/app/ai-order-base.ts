import { Router } from '@angular/router';
import { AiOrderService, AiOrderResponse, AiAvailableItem } from './ai-order.service';
import { ShoppingCartService } from './shopping-cart.service';

/**
 * Shared wiring for the AI Pizza Assistant and the Smart Meal Builder. Both features use
 * the exact same backend AI pipeline (Gemini -> MongoDB validation -> pricing) and the
 * exact same existing ShoppingCartService integration; only the presentation differs.
 */
export abstract class AiOrderBaseComponent {
  userText = '';
  isLoading = false;
  response: AiOrderResponse | null = null;
  errorMessage = '';

  constructor(
    protected readonly aiOrderService: AiOrderService,
    protected readonly cartService: ShoppingCartService,
    protected readonly router: Router
  ) { }

  submit(): void {
    const text = this.userText.trim();
    if (!text || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.response = null;

    this.aiOrderService.parseOrder(text).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.response = res;
        // Only ever reflect items that were actually pushed into the real cart state.
        if (res.anyAdded && res.cartItems?.length) {
          res.cartItems.forEach(item => this.cartService.addOrIncrementCart(item));
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Something went wrong reaching the assistant. Please try again.';
        console.error('AI order request failed', err);
      }
    });
  }

  goToCart(): void {
    this.router.navigate(['/shoppingcart']);
  }

  /** Joined display string of a validated item's available toppings, e.g. "Mushrooms, Jalapenos". */
  toppingNames(item: AiAvailableItem): string {
    return item.toppings.map(t => t.name).join(', ');
  }

  startOver(): void {
    this.userText = '';
    this.response = null;
    this.errorMessage = '';
  }
}
