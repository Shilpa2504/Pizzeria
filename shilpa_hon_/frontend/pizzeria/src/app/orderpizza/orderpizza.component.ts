import { Component, OnInit } from '@angular/core';
import { FetchdataService, Pizza } from '../fetchdata.service';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-orderpizza',
  templateUrl: './orderpizza.component.html',
  styleUrls: ['./orderpizza.component.css']
})
export class OrderpizzaComponent implements OnInit {

  orderPizzaData: Pizza[] = [];
  filteredPizzas: Pizza[] = [];
  searchQuery = '';
  notFetched = true;
  isLoading = false;
  errorMessage = '';

  selectedVegetarian: boolean | null = null;
  maxPriceFilter = 1000;
  sortBy: 'name' | 'price' | 'rating' = 'name';

  pizzaQuantities: { [key: string]: number } = {};

  constructor(
    private readonly fd: FetchdataService,
    private readonly cartService: ShoppingCartService
  ) { }

  ngOnInit(): void {
    this.loadPizzas();
    this.cartService.getCart$().subscribe(() => {
      this.syncQuantitiesFromCart();
    });
  }

  loadPizzas(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.fd.fetchOrderPizza().subscribe({
      next: (resp: Pizza[]) => {
        this.orderPizzaData = resp;
        this.filteredPizzas = resp;
        this.notFetched = false;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching pizzas:', error);
        this.errorMessage = 'Failed to load pizzas. Please try again.';
        this.notFetched = true;
        this.isLoading = false;
      }
    });
  }

  onSearch(): void { this.applyFilters(); }

  applyFilters(): void {
    this.filteredPizzas = this.orderPizzaData.filter(pizza => {
      if (this.searchQuery && !pizza.name.toLowerCase().includes(this.searchQuery.toLowerCase())) return false;
      if (this.selectedVegetarian !== null && this.isVeg(pizza) !== this.selectedVegetarian) return false;
      if (pizza.price > this.maxPriceFilter) return false;
      return true;
    });
    this.sortPizzas();
  }

  sortPizzas(): void {
    this.filteredPizzas.sort((a, b) => {
      if (this.sortBy === 'price') return a.price - b.price;
      if (this.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return a.name.localeCompare(b.name);
    });
  }

  isVeg(pizza: Pizza): boolean {
    if (typeof pizza.vegetarian === 'boolean') return pizza.vegetarian;
    if (pizza.type) return pizza.type.toLowerCase() === 'veg';
    return false;
  }

  getRatingStars(rating: number): number[] {
    return new Array(Math.round(rating || 0)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return new Array(5 - Math.round(rating || 0)).fill(0);
  }

  addToCart(pizza: Pizza): void {
    const pizzaId = pizza._id || pizza.name;
    const currentQty = this.getQuantity(pizza);
    if (currentQty === 0) {
      this.cartService.addToCart({
        id: pizzaId,
        name: pizza.name,
        price: pizza.price,
        quantity: 1,
        image: pizza.image,
        type: 'preset'
      });
      this.pizzaQuantities[pizzaId] = 1;
    } else {
      this.incrementQuantity(pizza);
    }
  }

  private syncQuantitiesFromCart(): void {
    const cartItems = this.cartService.getCart();
    this.pizzaQuantities = {};
    cartItems.forEach(item => {
      if (item.type === 'preset') {
        this.pizzaQuantities[item.id] = item.quantity;
      }
    });
  }

  getQuantity(pizza: Pizza): number {
    return this.pizzaQuantities[pizza._id || pizza.name] || 0;
  }

  isInCart(pizza: Pizza): boolean {
    return this.getQuantity(pizza) > 0;
  }

  incrementQuantity(pizza: Pizza): void {
    const pizzaId = pizza._id || pizza.name;
    const qty = this.getQuantity(pizza) + 1;
    this.cartService.updateQuantity(pizzaId, qty);
    this.pizzaQuantities[pizzaId] = qty;
  }

  decrementQuantity(pizza: Pizza): void {
    const pizzaId = pizza._id || pizza.name;
    const qty = this.getQuantity(pizza) - 1;
    if (qty <= 0) {
      this.cartService.removeFromCart(pizzaId);
      delete this.pizzaQuantities[pizzaId];
    } else {
      this.cartService.updateQuantity(pizzaId, qty);
      this.pizzaQuantities[pizzaId] = qty;
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedVegetarian = null;
    this.maxPriceFilter = 1000;
    this.sortBy = 'name';
    this.applyFilters();
  }
}
