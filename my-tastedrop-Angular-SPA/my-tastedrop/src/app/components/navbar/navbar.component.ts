import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  itemCount=0;

  constructor(private cartService: CartService){}

  ngOnInit(): void {
    this.updateCount();

    // update cart count every 500ms simple way to sync
    setInterval(() => this.updateCount(),500);
  }
  updateCount(): void{
    this.itemCount = this.cartService.getItemCount();
  }

  toggleDarkMode(): void {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', String(isDarkMode));
  }
}
