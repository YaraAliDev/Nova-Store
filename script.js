const products = [
    {id:1,name:"Elegant Summer Dress",category:"Clothing",price:650,image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",sizes:["S","M","L","XL"],colors:["Black","Beige","Pink"]},
    {id:2,name:"Classic White Shirt",category:"Clothing",price:420,image:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600",sizes:["S","M","L","XL"],colors:["White","Black"]},
    {id:3,name:"Casual Jeans",category:"Clothing",price:550,image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",sizes:["S","M","L","XL"],colors:["Blue","Black"]},
    {id:4,name:"Women's Blazer",category:"Clothing",price:850,image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",sizes:["S","M","L"],colors:["Black","Beige"]},
    {id:5,name:"Classic Sneakers",category:"Shoes",price:900,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",sizes:["37","38","39","40","41"],colors:["White","Black","Red"]},
    {id:6,name:"Daily Running Shoes",category:"Shoes",price:1100,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",sizes:["37","38","39","40","41"],colors:["Black","Pink"]},
    {id:7,name:"Elegant Heels",category:"Shoes",price:780,image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600",sizes:["37","38","39","40"],colors:["Black","Nude"]},
    {id:8,name:"Casual Sandals",category:"Shoes",price:450,image:"https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600",sizes:["37","38","39","40"],colors:["Brown","Black"]},
    {id:9,name:"Classic Handbag",category:"Bags",price:950,image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",sizes:["One Size"],colors:["Black","Brown","Beige"]},
    {id:10,name:"Mini Shoulder Bag",category:"Bags",price:620,image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600",sizes:["One Size"],colors:["Black","Pink"]},
    {id:11,name:"Travel Tote Bag",category:"Bags",price:750,image:"https://images.unsplash.com/photo-1544816155-12df9643f363?w=600",sizes:["One Size"],colors:["Beige","Brown"]},
    {id:12,name:"Evening Bag",category:"Bags",price:580,image:"https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600",sizes:["One Size"],colors:["Black","Silver"]},
    {id:13,name:"Golden Necklace",category:"Accessories",price:250,image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600",sizes:["One Size"],colors:["Gold","Silver"]},
    {id:14,name:"Elegant Sunglasses",category:"Accessories",price:350,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",sizes:["One Size"],colors:["Black","Brown"]},
    {id:15,name:"Classic Watch",category:"Accessories",price:700,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",sizes:["One Size"],colors:["Gold","Silver"]},
    {id:16,name:"Fashion Bracelet",category:"Accessories",price:220,image:"https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600",sizes:["One Size"],colors:["Gold","Silver"]}
];

let cart = JSON.parse(localStorage.getItem("novaCart")) || [];

function saveCart() {
    localStorage.setItem("novaCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    document.getElementById("cart-count").textContent =
        cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderProducts() {
    const list = document.getElementById("products-list");
    const search = document.getElementById("search").value.toLowerCase();
    const category = document.getElementById("category-filter").value;
    const sort = document.getElementById("sort-filter").value;

    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search);
        const matchesCategory = category === "All" || product.category === category;
        return matchesSearch && matchesCategory;
    });

    if (sort === "low") filtered.sort((a,b) => a.price-b.price);
    if (sort === "high") filtered.sort((a,b) => b.price-a.price);

    if (filtered.length === 0) {
        list.innerHTML = '<p class="empty-message">No products found.</p>';
        return;
    }

    list.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price} EGP</p>
                <button onclick="showProductDetails(${product.id})">View Details</button>
            </div>
        </article>
    `).join("");
}

function filterCategory(category) {
    document.getElementById("category-filter").value = category;
    renderProducts();
    document.getElementById("products").scrollIntoView({behavior:"smooth"});
}

function showProductDetails(id) {
    const product = products.find(item => item.id === id);

    const sizeOptions = product.sizes.map(size =>
        `<option value="${size}">${size}</option>`
    ).join("");

    const colorOptions = product.colors.map(color =>
        `<option value="${color}">${color}</option>`
    ).join("");

    const content = `
        <div class="modal-content">
            <button class="close-button" onclick="closeCart()">✕</button>
            <h2>${product.name}</h2>
            <img src="${product.image}" alt="${product.name}" style="width:100%;max-height:250px;object-fit:contain;">
            <p style="margin:15px 0;color:#b18a58;font-weight:bold">${product.price} EGP</p>
            <label>Choose Size</label>
            <select id="selected-size" style="display:block;width:100%;padding:12px;margin:10px 0 20px">
                ${sizeOptions}
            </select>
            <label>Choose Color</label>
            <select id="selected-color" style="display:block;width:100%;padding:12px;margin:10px 0 20px">
                ${colorOptions}
            </select>
            <button class="checkout-button" onclick="addToCart(${product.id})">Add To Cart</button>
        </div>
    `;

    const modal = document.getElementById("cart-modal");
    modal.innerHTML = content;
    modal.style.display = "block";
}

function addToCart(id) {
    const product = products.find(item => item.id === id);
    const size = document.getElementById("selected-size").value;
    const color = document.getElementById("selected-color").value;

    const existing = cart.find(item =>
        item.id === id && item.size === size && item.color === color
    );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...product,size,color,quantity:1});
    }

    saveCart();
    openCart();
}

function openCart() {
    const modal = document.getElementById("cart-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-button" onclick="closeCart()">✕</button>
            <h2>Your Shopping Cart</h2>
            <div id="cart-items"></div>
            <div id="cart-total"></div>
            <button class="checkout-button" onclick="goToCheckout()">Proceed to Checkout</button>
        </div>
    `;
    modal.style.display = "block";
    renderCart();
}

function closeCart() {
    document.getElementById("cart-modal").style.display = "none";
}

function renderCart() {
    const items = document.getElementById("cart-items");
    const total = document.getElementById("cart-total");

    if (cart.length === 0) {
        items.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
        total.textContent = "";
        return;
    }

    items.innerHTML = cart.map((item,index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>${item.price} EGP | ${item.size} | ${item.color}</p>
                <div class="quantity-controls">
                    <button onclick="changeQuantity(${index},-1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index},1)">+</button>
                    <button class="remove-button" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        </div>
    `).join("");

    total.textContent = `Subtotal: ${getSubtotal()} EGP`;
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index,1);
    saveCart();
    renderCart();
}

function removeItem(index) {
    cart.splice(index,1);
    saveCart();
    renderCart();
}

function getSubtotal() {
    return cart.reduce((sum,item) => sum + item.price * item.quantity,0);
}

function goToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    closeCart();
    document.querySelector("header").style.display = "none";
    document.querySelectorAll("body > section:not(#checkout-page), body > footer").forEach(el => {
        el.style.display = "none";
    });

    document.getElementById("checkout-page").style.display = "block";
    renderCheckout();
    window.scrollTo(0,0);
}

function renderCheckout() {
    const items = document.getElementById("checkout-items");

    items.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} × ${item.quantity}</span>
            <strong>${item.price * item.quantity} EGP</strong>
        </div>
    `).join("");

    const subtotal = getSubtotal();
    const shipping = 50;

    document.getElementById("subtotal").textContent = subtotal + " EGP";
    document.getElementById("shipping").textContent = shipping + " EGP";
    document.getElementById("final-total").textContent = subtotal + shipping + " EGP";
}

function backToShop() {
    document.querySelector("header").style.display = "flex";
    document.querySelectorAll("body > section:not(#checkout-page), body > footer").forEach(el => {
        el.style.display = "";
    });

    document.getElementById("checkout-page").style.display = "none";
    window.scrollTo(0,0);
}

document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const name = document.getElementById("customer-name").value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    const total = getSubtotal() + 50;

    alert(
        `Thank you, ${name}!\nYour order has been placed successfully.\nPayment: ${payment}\nTotal: ${total} EGP\n\nThis is a portfolio demo. No real payment was made.`
    );

    cart = [];
    saveCart();
    this.reset();
    backToShop();
    renderProducts();
});

renderProducts();
updateCartCount();