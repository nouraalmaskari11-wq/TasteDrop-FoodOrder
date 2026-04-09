// global var
let allMenu= [];   //store all menu items from json
let currentCategory ='All'; //currently selected category
let currentSearch='';
let currentSort='default';
let quantities={};


//  fetch menu data from data.jdon
async function loadMenu() {
    try{
        const response = await fetch('data.json');
        const data= await response.json();
        allMenu = data.menu;

        // initialize quantities to 1for each item
        allMenu.forEach(item=>{quantities[item.id]=1;
        });

        renderCategoryTabs();  //creat filter buttons
        renderMenuItems();  //display all items
        attachToolbarEvents();
    } catch (error) {
        console.error('Error loading menu', error);
        document.getElementById('menuItemsContainer').innerHTML= '<div class="alert alert-danger"> Failed to lad menu data.</div>';
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
    // 1. start with all items
    let filtered =[...allMenu];

    // 2.apply category filter
    if (currentCategory !== 'All'){
    filtered =filtered.filter(item=>item.category===currentCategory);
}

    //3. apply search filter
    if (currentSearch.trim()){
        const term =currentSearch.toLowerCase();
        filtered = filtered.filter(item=> item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)
    );
    }

    //4. apply sort
    if (currentSort==='low'){
        filtered.sort((a,b)=> a.price -b.price);
    } else if (currentSort==='high'){
        filtered.sort((a,b)=> b.price - a.price);
    }
    
const container = document.getElementById('menuItemsContainer');
if (!container) return;
if(filtered.length===0){
container.innerHTML= '<p class="text-center">No dishes found in this category.</p>';
return;
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

    <!-- quantity selector (only if available) -->
    ${item.available ? `
        <div class="qty-selector">
        <button class="qty-btn qty-dec" data-id="${item.id}">-</button>
        <span class="qty-value" id="qty-${item.id}">${quantities[item.id] || 1}</span>
        <button class="qty-btn qty-inc" data-id="${item.id}">+</button>
        </div>
        `: ''}

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

    // attach quantity button events
    document.querySelectorAll('.qty-dec').forEach(btn=>{
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id= parseInt(btn.dataset.id);
            if (quantities[id]>1){
                quantities[id]--;
                document.getElementById(`qty-${id}`).innerText = quantities[id];
            }
        });
});

    document.querySelectorAll('.qty-inc').forEach(btn=>{
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id= parseInt(btn.dataset.id);
                quantities[id]++;
                document.getElementById(`qty-${id}`).innerText = quantities[id];
        });
});

    // add event listeners to "add to cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> {
        const id = parseInt(btn.dataset.id);
        const name = btn.dataset.name;
        const price =parseFloat(btn.dataset.price);
        const quantity = quantities[id] || 1 ;
        addToCart(id, name, price, quantity); 
        quantities[id] =1; //re set quantity to 1 after adding
        const qtySpan = document.getElementById(`qty-${id}`);
        if (qtySpan) qtySpan.innerText =1;
    });
});
}

function attachToolbarEvents(){
    const searchInput = document.getElementById('searchInput');
    if (searchInput){
        searchInput.addEventListener('keyup', (e)=> {
            currentSearch =e.target.value;
            renderMenuItems();
        });
    }

    //sort dropdown
const sortSelect= document.getElementById('sortSelect');
if (sortSelect){
    sortSelect.addEventListener('change', (e) =>{
        currentSort = e.target.value;
        renderMenuItems();
    });
}
}
// start function
loadMenu();