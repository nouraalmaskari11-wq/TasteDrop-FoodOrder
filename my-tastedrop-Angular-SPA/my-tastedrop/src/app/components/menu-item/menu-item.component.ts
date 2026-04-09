import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'src/app/models/menu-item';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent {
  @Input() item!: MenuItem;
  @Output() addToCart = new EventEmitter<MenuItem>();
  quantity = 1;

  increaseQty(): void{
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1){
      this.quantity--;
    }
  }
}
