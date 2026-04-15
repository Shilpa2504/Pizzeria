import { Component } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { Router } from '@angular/router';
import { FetchdataService } from '../fetchdata.service';

export interface BuildPizza {
  id: string;
  tname: string;
  price: number;
  checked: boolean;
  image: string;
}

@Component({
  selector: 'app-buildpizza',
  templateUrl: './buildpizza.component.html',
  styleUrls: ['./buildpizza.component.css']
})
export class BuildpizzaComponent {
  customPizzaData: BuildPizza[] = [];
  checkedIngredients: BuildPizza[] = [];
  cost = 0;
  notFetched = true;
  isLoading = true;

  constructor(
    private readonly fd: FetchdataService,
    private readonly router: Router,
    private readonly cartService: ShoppingCartService
  ) {
    this.fd.fetchBuildPizza().subscribe({
      next: (response) => {
        this.customPizzaData = response.map(ing => ({
          id: ing._id || ing.tname || ing.name || '',
          tname: ing.tname || ing.name || '',
          price: ing.price,
          checked: false,
          image: ing.image || ''
        }));
        this.notFetched = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching ingredients', error);
        this.isLoading = false;
      }
    });
  }

  toggleIngredient(ingredient: BuildPizza): void {
    ingredient.checked = !ingredient.checked;
    if (ingredient.checked) {
      this.checkedIngredients.push(ingredient);
      this.cost += ingredient.price;
    } else {
      this.checkedIngredients = this.checkedIngredients.filter(item => item.id !== ingredient.id);
      this.cost -= ingredient.price;
    }
  }

  sendIngredients(): void {
    if (this.checkedIngredients.length === 0) return;
    this.cartService.addToCart({
      id: `custom_${Date.now()}`,
      name: `Custom Pizza (${this.checkedIngredients.map(i => i.tname).join(', ')})`,
      price: this.cost,
      quantity: 1,
      type: 'custom'
    });
    this.router.navigate(['/shoppingcart']);
  }
}
