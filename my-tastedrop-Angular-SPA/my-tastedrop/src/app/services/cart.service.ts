import { Injectable } from '@angular/core';
import { CartItem, MenuItem} from '../models/menu-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[]=[];

  constructor() { 
    const saved = localStorage.getItem('angular-cart');
    if (saved) this.items = JSON.parse(saved);
  }
 
  getItems(): CartItem[] {return[...this.items];}
  getItemCount ():number {return this.items.reduce((sum,i) => sum + i.quantity,0);}
  getTotal ():number {return this.items.reduce((sum,i) => sum + (i.price*i.quantity),0);}

  addItem(item: MenuItem, quantity:number =1): void {
    const existing = this.items.find(i => i.id === item.id);
    if (existing) existing.quantity += quantity;
    else this.items.push({...item, quantity});
    this.saveToLocal();
  }
  
  removeItem(id: number): void {
    this.items = this.items.filter( i => i.id !== id );
    this.saveToLocal();
  }

  updateQuantity(id: number, quantity: number): void {
    const item =this.items.find(i => i.id ===id);
    if (item){
      if(quantity <= 0) this.removeItem(id);
      else item.quantity = quantity;
      this.saveToLocal();
    }
  }

clearCart(): void {this.items = []; this.saveToLocal();}
private saveToLocal(): void { localStorage.setItem('angular-cart', JSON.stringify(this.items));}
}
