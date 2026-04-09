# TasteDrop – Online Food Ordering Frontend

A complete food ordering system with two versions:
1. **Static Website** (HTML/CSS/JS + Bootstrap)
2. **Angular SPA** (Angular 16)

## Pages

### Static Website
- **Home** (`index.html`) – Hero section, How It Works, Popular Dishes (from JSON), Testimonials, Footer
- **Menu** (`menu.html`) – Category tabs, search by name, sort by price, quantity selector, add to cart
- **Cart** (`cart.html`) – Cart table with quantity controls, remove button, order summary, promo codes, checkout form, order confirmation
- **About** (`about.html`) – Information about TasteDrop
- **Contact** (`contact.html`) – Contact form and restaurant information

### Angular SPA (`my-tastedrop`)
- **Components**: Navbar, MenuList, MenuItem, CartSummary
- **CartService**: Singleton with addItem, removeItem, getTotal, localStorage sync
- **Directives**: *ngFor, *ngIf, ngSwitch for category badges
- **Input/Output**: MenuItemComponent receives @Input item and emits @Output addToCart
- **Routing**: `/menu` → MenuListComponent, `/cart` → CartSummaryComponent

## Features

- ✅ Responsive design with Bootstrap 5
- ✅ Dark mode with localStorage persistence
- ✅ Shopping cart stored in localStorage
- ✅ Menu data loaded from `data.json` (12 items)
- ✅ Category filtering, search, sort by price
- ✅ Quantity selector (+/-) for each dish
- ✅ Promo codes: TASTE10 (10% off), FREEDEL (free delivery)
- ✅ Checkout form with validation (name, address, phone, card number)
- ✅ Order confirmation with random Order ID (5 digits) and ETA (35 minutes)

## Project Structure

TasteDrop/
├── index.html
├── menu.html
├── cart.html
├── about.html
├── contact.html
├── data.json
├── css/
│ └── style.css
├── js/
│ ├── common.js
│ ├── home.js
│ ├── menu.js
│ └── cart.js
├── assets/
│ └── fork.png
├── my-tastedrop/ # Angular SPA project
│ ├── src/
│ ├── angular.json
│ └── package.json
└── README.md


## How to Run

### Static Website
1. Clone the repository
2. Open the folder in VS Code
3. Install **Live Server** extension
4. Right-click `index.html` → Open with Live Server

### Angular App
1. Navigate to the Angular project:
   ```bash
   cd my-tastedrop
   npm install
   ng serve
   Open http://localhost:4200/menu

## Technologies
- Bootstrap 5.0.2
- Font Awesome 
- Google Fonts (Poppins)
- LocalStorage API

---

**Project completed as part of a frontend training assignment.**
