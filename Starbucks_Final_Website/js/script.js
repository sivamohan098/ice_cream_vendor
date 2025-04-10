// Utility Functions for Cart (Multiple Items, Quantity, Delivery Calculation)
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add an item from Menu to the Cart
function addToCart(name, price, qty, image) {
  qty = parseInt(qty);
  if (isNaN(qty) || qty < 1) qty = 1;
  let cart = getCart();
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ name, price, quantity: qty, image });
  }
  saveCart(cart);
  alert(`${name} (Qty: ${qty}) added to cart!`);
}

// Render Cart Items and Update Total
function renderCart() {
  const cartContainer = document.getElementById('cartItems');
  let cart = getCart();
  cartContainer.innerHTML = '';
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>No items in your cart.</p>';
    document.getElementById('cartTotal').innerText = '';
    return;
  }
  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <p><strong>${item.name}</strong></p>
        <p>Price: ₹${item.price}</p>
        <p>Quantity: <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${index}, this.value)"></p>
        <p>Subtotal: ₹${item.price * item.quantity}</p>
      </div>
    `;
    cartContainer.appendChild(div);
  });
  updateCartTotal();
}

// Update quantity for a cart item
function updateQuantity(index, newQty) {
  newQty = parseInt(newQty);
  if (isNaN(newQty) || newQty < 1) newQty = 1;
  let cart = getCart();
  cart[index].quantity = newQty;
  saveCart(cart);
  renderCart();
}

// Update Cart Total with Delivery Charges
function updateCartTotal() {
  let cart = getCart();
  let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const location = document.getElementById('location');
  let delivery = (location && location.value === 'Other') ? 50 : 0;
  total += delivery;
  document.getElementById('cartTotal').innerText = `Total (including delivery): ₹${total}`;
}

// Place Order and Clear Cart
function placeOrder() {
  if (getCart().length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Order placed successfully!');
  localStorage.removeItem('cart');
  renderCart();
}

// On Cart Page Load, render the cart items if the element exists
if (document.getElementById('cartItems')) {
  renderCart();
}
