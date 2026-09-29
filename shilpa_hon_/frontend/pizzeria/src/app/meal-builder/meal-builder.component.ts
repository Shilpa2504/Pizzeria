import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AiOrderService } from '../ai-order.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { AiOrderBaseComponent } from '../ai-order-base';

@Component({
  selector: 'app-meal-builder',
  templateUrl: './meal-builder.component.html',
  styleUrls: ['./meal-builder.component.css']
})
export class MealBuilderComponent extends AiOrderBaseComponent {
  constructor(aiOrderService: AiOrderService, cartService: ShoppingCartService, router: Router) {
    super(aiOrderService, cartService, router);
  }
}
