// ======== cart page ==========
let appliedPromo = null;

// Safe cart getter with error handling
function safeGetCart() {
  try {
    return getCart();
  } catch (e) {
    console.error('Cart parse error:', e);
    localStorage.removeItem('cart');
    return [];
  }
}

// render cart table and update all totals
function renderCart(){
  const cart = safeGetCart();
const tbody =document.getElementById('cartTableBody');
const summaryDiv = document.getElementById('orderSummary');
const emptyDiv =document.getElementById('emptyCartMessage');
const cartContentDiv = document.getElementById('cartContent');
const promoSection = document.getElementById('promoSection');
const checkoutForm = document.getElementById('checkoutForm');
const orderConfirm = document.getElementById('orderConfirmation');
if (cart.length ===0){
    //show empty cart message and hide table and summary 
    tbody.innerHTML='<tr><td colspan="5" class="text-center">Your cart is empty. <a href="menu.html">Go to Menu</a></td></tr>';
    if(summaryDiv) summaryDiv.style.display ='none';
    if (promoSection) promoSection.style.display ='none';
    if (checkoutForm) checkoutForm.style.display ='none';
    if (orderConfirm) orderConfirm.style.display ='none';
    if (emptyDiv) emptyDiv.style.display ='block';
    if (cartContentDiv) cartContentDiv.style.display ='none';
    return;
}
// show  table and summary and hide empty message
 if(summaryDiv) summaryDiv.style.display ='block';
    if (promoSection) promoSection.style.display ='block';
    if (checkoutForm) checkoutForm.style.display ='block';
    if (emptyDiv) emptyDiv.style.display ='none';
    if (cartContentDiv) cartContentDiv.style.display ='flex';
    if (orderConfirm) orderConfirm.style.display ='none';

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
  // Delegation events already attached
}

// update subtotal, delivery, total
function updateSummary(){
    const cart =safeGetCart();
    let subtotal =0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    let delivery =1.5;
    let discount =0;
    if(appliedPromo){
        if(appliedPromo.type ==='percentage'){
            discount=subtotal*appliedPromo.value /100;
        }else if (appliedPromo.type ==='flat'){
            delivery=0
        }
    }

    const total = subtotal - discount + delivery;

    const subtotalEl =document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('deliveryFee');
    const totalEl = document.getElementById('total');
    if(subtotalEl) subtotalEl.innerText= subtotal.toFixed(3);
    if (deliveryFeeEl) deliveryFeeEl.innerText =delivery.toFixed(3);
    if(totalEl) totalEl.innerText=total.toFixed(3);

    // show /hide discount row 
      let discountRow = document.getElementById('discountRow');
    if (discount > 0) {
        if (!discountRow) {
            const summaryCard = document.querySelector('.summary-card');
            const totalRow = document.querySelector('.summary-row.total');
            discountRow = document.createElement('div');
            discountRow.className = 'summary-row discount';
            discountRow.id = 'discountRow';
            discountRow.innerHTML = `<span>Discount</span><span id="discountAmount">-${discount.toFixed(3)}</span> OMR`;
            totalRow.parentNode.insertBefore(discountRow, totalRow);
        } else {
            document.getElementById('discountAmount').innerText = discount.toFixed(3);
            discountRow.style.display = 'flex';
        }
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }
}

// Promo event delegation (no cloning)
document.addEventListener('click', function(e) {
  if (e.target.id === 'applyPromoBtn') {
    const input = document.getElementById('promoInput');
    const msg = document.getElementById('promoMsg');
    const code = input ? input.value.trim().toUpperCase() : '';

    if (code === 'TASTE10') {
      appliedPromo = { type: 'percentage', value: 10 };
      msg.innerText = 'TASTE10 applied! 10% discount';
      msg.style.color = '#10b981';
      msg.style.display = 'block';
    } else if (code === 'FREEDEL') {
      appliedPromo = { type: 'flat', value: 1.5 };
      msg.innerText = 'FREEDEL applied! Free delivery';
      msg.style.color = '#10b981';
      msg.style.display = 'block';
    } else if (code === '') {
      appliedPromo = null;
      msg.style.display = 'none';
    } else {
      appliedPromo = null;
      msg.innerText = 'Invalid promo code';
      msg.style.color = '#dc2626';
      msg.style.display = 'block';
    }
    updateSummary();
  }
});

// Payment toggle delegation (no cloning)
document.addEventListener('change', function(e) {
  const cardDiv = document.getElementById('cardNumberDiv');
  if (!cardDiv) return;
  if (e.target.id === 'payCash') {
    cardDiv.style.display = 'none';
  } else if (e.target.id === 'payCard') {
    cardDiv.style.display = 'block';
  }
});

// Form submit delegation (no cloning)
document.addEventListener('submit', function(e) {
  if (e.target.id === 'checkoutFormEl') {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('custName');
    const address = document.getElementById('custAddress');
    const phone = document.getElementById('custPhone');
    const payment = document.querySelector('input[name="paymentMethod"]:checked');
    const cardNum = document.getElementById('cardNumber');

    // Reset validation
    [name, address, phone, cardNum].forEach(inp => {
      if (inp) inp.classList.remove('is-invalid');
    });

    if (!name.value.trim()) { name.classList.add('is-invalid'); valid = false; }
    if (!address.value.trim()) { address.classList.add('is-invalid'); valid = false; }

    const phoneDigits = phone.value.replace(/\s/g, '');
    if (!phoneDigits || !/^\d+$/.test(phoneDigits)) {
      phone.classList.add('is-invalid');
      valid = false;
    }

    if (payment && payment.value === 'card') {
      const cardDigits = cardNum.value.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cardDigits)) {
        cardNum.classList.add('is-invalid');
        valid = false;
      }
    }

    if (!valid) return;

    // Place order
    placeOrder();
  }
});

// Place order: clear cart, show confirmation
function placeOrder() {
    const cart = getCart();
    const orderId = Math.floor(10000 + Math.random() * 90000);
    const eta = '35 minutes';

    let itemsHtml = '<div class="confirm-details">';
    cart.forEach(item => {
        itemsHtml += `<div class="confirm-row"><span>${item.quantity} x ${item.name}</span><span>${(item.price * item.quantity).toFixed(3)} OMR</span></div>`;
    });
    itemsHtml += '</div>';

    const confirmHtml = `
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Estimated Delivery:</strong> ${eta}</p>
        ${itemsHtml}
    `;

    document.getElementById('confirmDetails').innerHTML = confirmHtml;
    document.getElementById('orderConfirmation').style.display = 'block';
    document.getElementById('orderSummary').style.display = 'none';
    document.getElementById('promoSection').style.display = 'none';
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('cartContent').style.display = 'none';

    // Clear cart
    localStorage.removeItem('cart');
    updateCartBadge();

    // Auto-hide after 5s and re-render empty cart
    setTimeout(() => {
        document.getElementById('orderConfirmation').style.display = 'none';
        document.getElementById('cartContent').style.display = 'flex';
        renderCart();  // Shows empty state
    }, 1000);
}

// Attach cart events (+ / - / remove)
function attachCartEvents() {
    document.querySelectorAll('.cart-qty-inc').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const id = parseInt(this.dataset.id);
            const cart = getCart();
            const item = cart.find(i => i.id === id);
            if (item) {
                updateCartQuantity(id, item.quantity + 1);
                renderCart();
            }
        };
    });

    document.querySelectorAll('.cart-qty-dec').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const id = parseInt(this.dataset.id);
            const cart = getCart();
            const item = cart.find(i => i.id === id);
            if (item && item.quantity > 1) {
                updateCartQuantity(id, item.quantity - 1);
                renderCart();
            } else if (item && item.quantity === 1) {
                removeFromCart(id);
                renderCart();
            }
        };
    });

    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const id = parseInt(this.dataset.id);
            removeFromCart(id);
            renderCart();
        };
    });
}

// Initial render on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  renderCart();
});






