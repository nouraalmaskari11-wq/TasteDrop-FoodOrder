// ===========CART FUNCTIONS >> localStorage============


// get cart from local storage or return empty array if first visit
function getCart(){
    return JSON.parse(localStorage.getItem('cart')) || [];
}


// save cart to local storage and update the badge
function saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}


// update the cart item count badge in the navbar
function updateCartBadge(){
    const cart= getCart();
    const totalItems= cart.reduce((sum,item)=> sum+ item.quantity,0);
    const badge=document.getElementById('cartCount');
    if (badge){ badge.innerText= totalItems;
    // add bump animation
    badge.classList.add('bump');
    setTimeout(()=> badge.classList.remove('bump'),300);
}
}


// add an item to the cart or increase quantity if already present 
function addToCart(id, name, price, quantity){
    let cart= getCart();
    const existing =cart.find (item=> item.id ===id);
    if (existing){
        existing.quantity += quantity;
    }else {
        cart.push({id, name, price, quantity});
    }
    saveCart(cart);
}

function removeFromCart(id){
    let cart= getCart();
    cart= cart.filter(item=> item.id !==id);
    saveCart(cart);
}


// update quantity of a specific cart item
function updateCartQuantity(id, newQuantity){
    if(newQuantity<=0){
        removeFromCart(id);
        return;
    }
    let cart= getCart();
    const item =cart.find(item => item.id ===id);
    if (item) item.quantity = newQuantity;
    saveCart(cart);
}

//  initialize dark mode : load preference from localstroage and listen to toggle button
function initDarkMode(){
    const darkMode =localStorage.getItem('darkMode')==='true';
    if(darkMode) document.body.classList.add('dark-mode');
    const toggle = document.getElementById('darkModeToggle');
    if (toggle){
        toggle.addEventListener('click', ()=>{
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
    }
}

// run when DOM is ready
document.addEventListener('DOMContentLoaded', ()=>{
    initDarkMode();
    updateCartBadge();
});