import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'src/app/models/menu-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit{
  allItems: MenuItem[]= [];
  filteredItems: MenuItem[] =[];
  categories: string[]= ['All', 'Starters', 'Main Course', 'Pizza', 'Burgers', 'Desserts', 'Drinks'];
  selectedCategory= 'All';
  searchTerm ='';
  sortBy= 'default';

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ){}
 ngOnInit(): void {
   this.http.get<{menu: MenuItem[]}>('assets/data.json').subscribe({
    next:(data) => {
      this.allItems = data.menu;
      this.applyFilters();
    },
    error: (err) => console.error('Error loading menu:',err)
   });
 }

 applyFilters(): void {
  let items = [...this.allItems];

  // category filter
  if (this.selectedCategory !== 'All'){
   items = items.filter(i => i.category === this.selectedCategory);
  }

  //search filter
  if (this.searchTerm.trim()){
    const term = this.searchTerm.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(term) || i.description.toLowerCase().includes(term));
  }

  //sort 
  if (this.sortBy === 'low'){
    items.sort((a,b) => a.price - b.price);
  } else if (this.sortBy === 'high'){
    items.sort((a,b) => b.price - a.price);
  }
  this.filteredItems =items;
 }

 onAddToCart(item: MenuItem): void{
  this.cartService.addItem(item, 1);
 }
}
