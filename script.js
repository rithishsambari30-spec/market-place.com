// Password protection for Admin
function checkLogin(){
  const pass = document.getElementById("adminPass")?.value;
  if(pass === "vinish123"){ 
    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";
  } else {
    alert("Wrong password!");
  }
}

// Shared products - Always reload from localStorage
let products = JSON.parse(localStorage.getItem("products")) || [
  {id:1, name:"Classic Shirt", price:999, image:"html (4).jpg"},
  {id:2, name:"Premium Hoodie", price:1499, image:"html (5).jpg"},
  {id:3, name:"Modern Outfit", price:1999, image:"html (4).jpg"}
];

// Save to localStorage immediately
localStorage.setItem("products", JSON.stringify(products));

// Admin Panel
function renderTable(){
  const tbody = document.querySelector("#product-table tbody");
  if(!tbody) return;
  tbody.innerHTML = "";
  products.forEach((p,i)=>{
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>₹${p.price}</td>
        <td><img src="images/${p.image}" width="80"></td>
        <td>
          <button onclick="editProduct(${i})">Edit</button>
          <button onclick="deleteProduct(${i})">Delete</button>
        </td>
      </tr>
    `;
  });
  localStorage.setItem("products", JSON.stringify(products));
}

function addProduct(){
  const name = document.getElementById("name")?.value;
  const price = document.getElementById("price")?.value;
  const image = document.getElementById("image")?.value;
  if(name && price && image){
    const newProduct = { id: products.length+1, name, price: parseInt(price), image };
    products.push(newProduct);
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";
    renderTable();
    alert("Product added successfully!");
  } else {
    alert("Please fill all fields!");
  }
}

function deleteProduct(index){
  products.splice(index,1);
  renderTable();
}

function editProduct(index){
  const p = products[index];
  document.getElementById("editId").value = index;
  document.getElementById("editName").value = p.name;
  document.getElementById("editPrice").value = p.price;
  document.getElementById("editImage").value = p.image;
  document.getElementById("editModal").style.display = "block";
}

function saveEdit(){
  const index = parseInt(document.getElementById("editId").value);
  products[index].name = document.getElementById("editName").value;
  products[index].price = document.getElementById("editPrice").value;
  products[index].image = document.getElementById("editImage").value;
  document.getElementById("editModal").style.display = "none";
  renderTable();
}

function closeEditModal(){
  document.getElementById("editModal").style.display = "none";
}

// Category Page - Load products dynamically
function showProducts(){
  const productContainer = document.getElementById("product-list");
  if(!productContainer) {
    console.log("Product container not found");
    return;
  }
  
  // Reload products from localStorage to ensure latest data
  products = JSON.parse(localStorage.getItem("products")) || products;
  
  console.log("Showing products:", products);
  console.log("Product container found, clearing and populating...");
  
  productContainer.innerHTML = "";
  
  if(products.length === 0) {
    productContainer.innerHTML = "<p>No products available</p>";
    return;
  }
  
  products.forEach((product,index)=>{
    const cardHTML = `
      <div class="card">
        <a href="product.html?id=${product.id}">
          <img src="images/${product.image}" class="product-image" alt="${product.name}" 
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22220%22 height=%22220%22%3E%3Crect fill=%22%23ddd%22 width=%22220%22 height=%22220%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%23666%22%3EImage not found%3C/text%3E%3C/svg%3E'">
          <h3>${product.name}</h3>
        </a>
        <p>₹${product.price}</p>
        <button onclick="addToCart(${index})">Add To Cart</button>
      </div>
    `;
    productContainer.innerHTML += cardHTML;
  });
  console.log("Products populated successfully");
}

// Initialize pages - Call immediately and on DOM ready
function initializePages(){
  console.log("Initializing pages...");
  renderTable();
  showProducts();
  updateCart();
  console.log("Initialization complete");
}

// Run on different load events for maximum compatibility
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initializePages);
} else {
  initializePages();
}

// Also run after a small delay to ensure everything is rendered
setTimeout(initializePages, 100);

// Cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContainer = document.getElementById("cart-list");
const totalPriceElement = document.getElementById("total-price");

function addToCart(index){
  cart.push(products[index]);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(products[index].name + " added to cart");
}

function updateCart(){
  if(!cartContainer) return;
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item,i)=>{
    total += parseInt(item.price);
    cartContainer.innerHTML += `
      <div class="card">
        <img src="images/${item.image}" class="product-image">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `;
  });
  totalPriceElement.innerText = "Total: ₹" + total;
}

function removeFromCart(index){
  cart.splice(index,1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// Product Details
function showProductDetails(){
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const product = products.find(p => p.id === id);
  if(product){
    document.body.innerHTML += `
      <section class="product-details">
        <h2>${product.name}</h2>
        <img src="images/${product.image}" class="product-image">
        <p>Price: ₹${product.price}</p>
        <p>Description: Premium product curated for you.</p>
        <button onclick="buyNow(${product.id})">Buy Now</button>
      </section>
    `;
  }
}

function buyNow(id){
  window.location.href = "order.html?id=" + id;
}

// Run
renderTable();
showProducts();
updateCart();
showProductDetails();