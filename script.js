// Cart functionality - store cart in localStorage
const CART_KEY = 'royalTeeCart';

function getCart() {
  const cartJson = localStorage.getItem(CART_KEY);
  return cartJson ? JSON.parse(cartJson) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  saveCart(cart);
  alert(`${product.name} added to cart.`);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCartItems();
}

function updateQuantity(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = qty < 1 ? 1 : qty;
    saveCart(cart);
    renderCartItems();
  }
}

function calculateTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCartItems() {
  const tbody = document.getElementById('cart-table-body');
  const totalEl = document.getElementById('cart-total');
  if (!tbody || !totalEl) return;
  
  const cart = getCart();
  tbody.innerHTML = '';
  
  if (cart.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.textContent = 'Your cart is empty.';
    td.style.textAlign = 'center';
    tr.appendChild(td);
    tbody.appendChild(tr);
    totalEl.textContent = '$0.00';
    return;
  }
  
  cart.forEach(item => {
    const tr = document.createElement('tr');
    
    const tdImg = document.createElement('td');
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.className = 'cart-img';
    img.style.width = '50px'; 
    img.style.height = '50px'; 
    tdImg.appendChild(img);
    tr.appendChild(tdImg);
    
    const tdName = document.createElement('td');
    tdName.textContent = item.name;
    tr.appendChild(tdName);
    
    const tdQty = document.createElement('td');
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.value = item.quantity;
    qtyInput.min = 1;
    qtyInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) {
        e.target.value = item.quantity;
        return;
      }
      updateQuantity(item.id, val);
    });
    tdQty.appendChild(qtyInput);
    tr.appendChild(tdQty);
    
    const tdPrice = document.createElement('td');
    tdPrice.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
    tr.appendChild(tdPrice);
    
    const tdRemove = document.createElement('td');
    const btnRemove = document.createElement('button');
    btnRemove.textContent = 'Remove';
    btnRemove.addEventListener('click', () => {
      removeFromCart(item.id);
    });
    tdRemove.appendChild(btnRemove);
    tr.appendChild(tdRemove);
    
    tbody.appendChild(tr);
  });
  
  totalEl.textContent = `$${calculateTotal().toFixed(2)}`;
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = count;

    // ✨ Animate bump
    countEl.classList.add('bump');
    setTimeout(() => {
      countEl.classList.remove('bump');
    }, 300);
  }
}


// Add to cart buttons on product listings or details
document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
  updateCartCount();

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id); // <-- Tambah parseInt di sini
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const image = btn.dataset.image;
      const quantity = 1;


      
      addToCart({ id, name, price, image, quantity });
    });
  });
});
