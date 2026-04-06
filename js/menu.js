// global var
let allMenu= [];   //store all menu items from json
let currentCategory ='All'; //currently selected category

//  fetch menu data from data.jdon
async function loadMenu() {
    try{
        const response = await fetch('data.json');
        const data= await response.json();
        allMenu = data.menu;
        renderCategoryTabs();  //creat filter buttons
        renderMenuItems();  //display all items
    } catch (error) {
        console.error('Error loading menu', error);
    }
}

// create category filter buttons 
function renderCategoryTabs(){
    // get unique categories from menu data
    const categories =['All', ...new Set(allMenu.map(item=>item.category))];
    const container = document.getElementById('categoryTabs');
    if (!container) return;

    // html for each category button
    container.innerHTML =categories.map(cat=>`<button class="btn btn-outline-primary category-btn ${cat === currentCategory ? 'active' : ''}" data-category="${cat}"> ${cat}</button>`).join('');

    //add click event to each button
    document.querySelectorAll('.category-btn').forEach(btn=>
    {
        btn.addEventListener('click',()=> {
            currentCategory=btn.dataset.category;
            renderCategoryTabs();   //re-render buttons to update active style
            renderMenuItems();  //re-render menu items with new filter
        });
    });
}

// display menu items based on selected category
function renderMenuItems(){
    // filter items by category if not All
    let filtered =[...allMenu];
    if (currentCategory !== 'All'){
    filtered =filtered.filter(item=>item.category===currentCategory);
}

const container = document.getElementById('menuItemsContainer');
if (!container) return;
if(filtered.length===0){
container.innerHTML= '<p class="text-center">No dishes found in this category.</p>';
return
}

// make html for each item
container.innerHTML=filtered.map(item=>`
    <div class="col-md-4 col-lg-3">
    <div class="card h-100">
    <img src="${item.image}" class="card-img-top" alt="${item.name}" style="height:180px; object-fit:cover;">
    <div class="card-body">
    <h5 class="card-title">${item.name}</h5>
    <span class="badge bg-secondary mb-2">${item.category}</span>
    <p class="card-text small">${item.description.substring(0,80)}...</p>
    <p class="fw-bold">${item.price} OMR</p>

    <!-- add to cart button (quantity will be added later)-->
    <button class="btn btn-primary w-100 add-to-cart-btn"
    data-id="${item.id}"
    data-name="${item.name}"
    data-price="${item.price}"
    ${!item.available ? 'disabled': ''}>
    ${item.available ? 'Add to Cart' : 'Out of Stock'}
    </button>
    </div>
    </div>
    </div>
    `).join('');

    // add event listeners to "add to cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> {
        const id = parseInt(btn.dataset.id);
        const name = btn.dataset.name;
        const price =parseFloat(btn.dataset.price);
        addToCart(id, name, price, 1);  //quantity =1 for now

        alert(`${name} added to cart!`);
    });
});
}
loadMenu();