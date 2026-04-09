import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css']
})
export class CartSummaryComponent {
constructor(public cartService: CartService){}

updateQuantity(id: number, delta: number): void{
  const items = this.cartService.getItems();
  const item = items.find(i => i.id === id);
  if (item){
    this.cartService.updateQuantity(id, item.quantity + delta)
  }
}
}
