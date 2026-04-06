// wait for full html to be loaded
document.addEventListener('DOMContentLoaded', async()=> {
    try{
        const response =await fetch ('data.json');
        const data= await response.json();

        // popular dishes
        const popularItems = data.menu.slice(0,4);

        // get container wher the popular dishes will be show
        const container= document.getElementById('popularDishes');

        // make html for each popular dish
         container.innerHTML = popularItems.map(item => `
      <div class="col-md-3">
        <div class="card h-100">
          <img src="${item.image}" class="card-img-top" alt="${item.name}" style="height: 180px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <span class="badge bg-secondary">${item.category}</span>
            <p class="card-text mt-2">${item.price} OMR</p>
            <button class="btn btn-primary btn-sm add-to-cart"
                    data-id="${item.id}"
                    data-name="${item.name}"
                    data-price="${item.price}">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // add click event to every "add to cart" button
    document.querySelectorAll('.add-to-cart').forEach(btn=>{
        btn.addEventListener('click', ()=> {
            const id =parseInt(btn.CDATA_SECTION_NODE.id);
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);

        // use the addtocart function from common.js ..quantity=1

    addToCart(id, name, price, 1);
        });
    });
    } catch (error){
        console.error('Error loading popular dishes', error)
    }
});