// ======== cart page ==========

// render cart table and update all totals
function renderCart(){
const cart = getCart();
const tbody =document.getElementById('cartTableBody');
const summaryDiv = document.getElementById('orderSummary');
const emptyDiv =document.getElementById('emptyCartMessage');
const cartContentDiv = document.getElementById('cartContent');
if (cart.length ===0){
    //show empty cart message and hide table and summary 
    tbody.innerHTML='<tr><td colspan="5" class="text-center">Your cart is empty. <a href="menu.html">Go to Menu</a></td></tr>';
    summaryDiv.style.display ='none';
    emptyDiv.style.display ='block';
    cartContentDiv.style.display ='none';
    return;
}
// show  table and summary and hide empty message
 summaryDiv.style.display ='block';
    emptyDiv.style.display ='none';
    cartContentDiv.style.display ='flex';

    // build table rows 
    let html ='';
    cart.forEach(item => {
        const subtotal = (item.price * item.quantity).toFixed(3);
        html +=`
        <tr>
        <td class="cart-item-name">${item.name}</td>
        <td>${item.price} OMR</td>
        <td> 
        <div class="d-flex align-items-center gap-2">
        <button class="qty-btn cart-qty-dec" data-id="${item.id}">-</button>
        <span class="qty-value" id="cartQty-${item.id}">${item.quantity}</span>
        <button class="qty-btn cart-qty-inc" data-id="${item.id}">+</button>
        </div>
        </td>
        <td class="fw-bold">${subtotal} OMR </td>
        <td>
        <button class="btn btn-sm btn-danger cart-remove" data-id="${item.id}">
        <i class="fas fa-trash"></i> Remove </button> </td> </tr>
        `;
    });
    tbody.innerHTML = html;

// updatesummary
updateSummary();

//attach event listeners
attachCartEvents();
}

// update subtotal, delivery, total
function updateSummary(){
    const cart =getCart();
    let subtotal =0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    const delivery =1.5;
    const total = subtotal + delivery;

    const subtotalEl =document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('deliveryFee');
    const totalEl = document.getElementById('total');
    if(subtotalEl) subtotalEl.innerText= subtotal.toFixed(3);
    if (deliveryFeeEl) deliveryFeeEl.innerText =delivery.toFixed(3);
    if(totalEl) totalEl.innerText=total.toFixed(3);
}

// attach event to quantity buttons and remove buttons
function attachCartEvents (){
    // to increase quantity 
    document.querySelectorAll('.cart-qty-inc').forEach(btn => {
        btn.removeEventListener('click', handleInc);
        btn.addEventListener('click', handleInc);
    });
     // to decrease quantity  
    document.querySelectorAll('.cart-qty-dec').forEach(btn => {
        btn.removeEventListener('click', handleDec);
        btn.addEventListener('click', handleDec);
    });

// to remove item 
document.querySelectorAll('.cart-remove').forEach(btn => {
    btn.removeEventListener('click', handleRemove);
    btn.addEventListener('click', handleRemove );
});
}

//handle increase button click 
function handleInc(e){
    const id =parseInt(e.currentTarget.dataset.id);
    const cart = getCart();
    const item = cart.find(i => i.id===id);
    if (item) {
        updateCartQuantity(id, item.quantity+1)
        renderCart();
    }
}


//handle decrease button click 
function handleDec(e){
    const id =parseInt(e.currentTarget.dataset.id);
    const cart = getCart();
    const item = cart.find(i => i.id===id);
    if (item && item.quantity >1) {
        updateCartQuantity(id, item.quantity-1)
        renderCart();
    } else if (item && item.quantity===1){
        removeFromCart(id);
        renderCart();
    }
}

// handle remove button click 
function handleRemove(e){
    const id = parseInt(e.currentTarget.dataset.id);
    removeFromCart(id);
    renderCart();
}


// initial render when page loads
renderCart();