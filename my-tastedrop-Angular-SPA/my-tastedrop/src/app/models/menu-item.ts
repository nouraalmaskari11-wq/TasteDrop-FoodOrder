// here is the menuite interface which matches data.json structure
export interface MenuItem {
    id:number;
    name:string;
    category:string;
    price:number;
    available:boolean;
    rating:number;
    description:string;
    image:string;
}


//cart item extends menuitem with quantity
export interface CartItem extends MenuItem {
    quantity:number;
}
