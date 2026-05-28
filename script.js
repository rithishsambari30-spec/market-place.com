const products = [
  { id: 1, name: 'Fashion', description: 'Comfortable noise-cancelling headphones with long battery life.', price: 79.99, image: 'https://images.unsplash.com/photo-1518446891627-0200b6acae8c?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'Electronics', description: 'Lightweight running shoes for everyday comfort.', price: 59.99, image: 'https://images.unsplash.com/photo-1528701800489-20d586c3f0f9?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'Furniture', description: 'Track fitness, sleep, and notifications on the go.', price: 129.99, image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=900&q=80' },
  { id: 4, name: 'Kitchen items', description: 'Durable travel backpack with multiple compartments.', price: 39.99, image: 'https://images.unsplash.com/photo-1527250515980-68f0ef45c83c?auto=format&fit=crop&w=900&q=80' },
  { id: 5, name: '', smart gadgets ,: 'Brew fresh coffee with this easy-to-use machine.', price: 49.99, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80' },
  { id: 6, name: 'Desk Lamp', description: 'Modern LED lamp with brightness control.', price: 24.99, image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80' }
];

const productGrid = document.getElementById('products');
const cartToggle = document.getElementById('cart-toggle');
const cartPanel = document.getElementById('cart-panel');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutButton = document.getElementById('checkout-button');
const searchInput = document.getElementById('search-input');

let cart = [];

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function renderProducts(filter = '') {
  const query = filter.trim().toLowerCase();
  const filtered = products.filter(product => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query));
  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-details">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="meta">
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>
        <button data-id="${product.id}">Add to cart</button>
      </div>
    </article>
  `).join('');
}

function updateCart() {
  cartItems.innerHTML = cart.length ? cart.map(item => `
    <div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <span>${item.quantity} × ${formatPrice(item.price)}</span>
      </div>
      <strong>${formatPrice(item.quantity * item.price)}</strong>
    </div>
  `).join('') : '<p>Your cart is empty.</p>';

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
}

productGrid.addEventListener('click', event => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  const id = Number(button.dataset.id);
  addToCart(id);
});

cartToggle.addEventListener('click', () => {
  cartPanel.classList.toggle('hidden');
});

cartClose.addEventListener('click', () => {
  cartPanel.classList.add('hidden');
});

checkoutButton.addEventListener('click', () => {
  if (!cart.length) {
    alert('Your cart is empty. Add some items first.');
    return;
  }
  alert('Checkout successful! Thank you for shopping.');
  cart = [];
  updateCart();
  cartPanel.classList.add('hidden');
});

searchInput.addEventListener('input', event => {
  renderProducts(event.target.value);
});

renderProducts();
updateCart();