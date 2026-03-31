'use strict';

/* ============================================
   DRAPE — SHOP.JS v2
   ✅ Working Add to Cart
   ✅ Hero auto-slider
   ✅ 12 products with real images
   ✅ Category filters
   ✅ AI Chatbot (OpenAI)
   ============================================ */

const PRODUCTS = [
  { id:1,  name:"Floral Summer Dress",       category:"dresses", price:1299, mrp:1899, discount:32, img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", badge:"new"  },
  { id:2,  name:"Sunset Wrap Dress",         category:"dresses", price:1799, mrp:2499, discount:28, img:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80", badge:"sale" },
  { id:3,  name:"Boho Maxi Dress",           category:"dresses", price:1599, mrp:2199, discount:27, img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", badge:null   },
  { id:4,  name:"Stylish Linen Top",         category:"tops",    price:899,  mrp:1299, discount:31, img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80", badge:"new"  },
  { id:5,  name:"Off-Shoulder Blouse",       category:"tops",    price:999,  mrp:1399, discount:29, img:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80", badge:null   },
  { id:6,  name:"Striped Crop Top",          category:"tops",    price:699,  mrp:999,  discount:30, img:"https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&q=80", badge:"sale" },
  { id:7,  name:"Chikankari Kurta",          category:"kurtas",  price:1499, mrp:1999, discount:25, img:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80", badge:"new"  },
  { id:8,  name:"Block Print Kurta Set",     category:"kurtas",  price:1299, mrp:1799, discount:28, img:"https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80", badge:null   },
  { id:9,  name:"Straight Kurti with Palazzo",category:"kurtas", price:1199, mrp:1699, discount:29, img:"https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=400&q=80", badge:"sale" },
  { id:10, name:"Pastel Co-ord Set",         category:"coords",  price:2499, mrp:3499, discount:29, img:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80", badge:"new"  },
  { id:11, name:"Rust Linen Co-ord",         category:"coords",  price:2199, mrp:2999, discount:27, img:"https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80", badge:null   },
  { id:12, name:"Printed Blazer Set",        category:"coords",  price:2799, mrp:3999, discount:30, img:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", badge:"sale" }
];

let cart = JSON.parse(localStorage.getItem('drape_cart') || '[]');
let apiKey = '';
let chatHistory = [];
let currentSlide = 0;
let slideTimer;

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(PRODUCTS);
  updateCartUI();
  initHeader();
  initCart();
  initChatbot();
  initSearch();
  initSlider();
});

// ---- HEADER ----
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ---- SEARCH ----
function toggleSearch() {
  const bar = document.getElementById('searchBar');
  bar.classList.toggle('open');
  if (bar.classList.contains('open')) document.getElementById('searchInput').focus();
}

function initSearch() {
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = q ? PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : PRODUCTS;
    renderProducts(filtered);
    if (q) document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });
}

// ---- HERO SLIDER ----
function initSlider() {
  startSliderAuto();
}

function startSliderAuto() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => changeSlide(1), 4500);
}

function changeSlide(dir) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots .dot');
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  startSliderAuto();
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots .dot');
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  startSliderAuto();
}

// ---- RENDER PRODUCTS ----
function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#b0a9a1">
      <div style="font-size:3rem;margin-bottom:12px">🔍</div>
      <p style="font-family:'Cormorant Garamond',serif;font-size:1.4rem">No items found</p>
    </div>`;
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="prod-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<span class="prod-badge ${p.badge === 'new' ? 'badge-new' : 'badge-sale'}">${p.badge === 'new' ? 'New' : 'Sale'}</span>` : ''}
        <button class="prod-wishlist" onclick="toggleWishlist(this)">🤍</button>
        <button class="prod-add-btn" onclick="addToCart(${p.id})">+ Add to Bag</button>
      </div>
      <div class="prod-info">
        <p class="prod-cat">${p.category}</p>
        <h3 class="prod-name">${p.name}</h3>
        <div class="prod-pricing">
          <span class="prod-price">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="prod-mrp">₹${p.mrp.toLocaleString('en-IN')}</span>
          <span class="prod-discount">${p.discount}% off</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ---- FILTERS ----
function filterProducts(category, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const filtered = category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
  renderProducts(filtered);
  const label = document.getElementById('productsLabel');
  if (label) label.textContent = category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1);
}

function filterByCategory(cat) {
  filterProducts(cat, null);
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function toggleWishlist(btn) {
  const liked = btn.textContent === '❤️';
  btn.textContent = liked ? '🤍' : '❤️';
  btn.style.background = liked ? 'white' : '#fff0f0';
  showToast(liked ? 'Removed from wishlist' : 'Added to wishlist ❤️');
}

// ---- CART ----
function initCart() {
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('continueShopping').addEventListener('click', closeCart);
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) { existing.qty++; } else { cart.push({ ...product, qty: 1 }); }
  saveCart();
  updateCartUI();
  showToast(`${product.name} added to bag 🛍️`);
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('drape_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const indicator = document.getElementById('cartIndicator');
  const count = document.getElementById('cartCount');
  indicator.style.display = totalQty > 0 ? 'flex' : 'none';
  indicator.textContent = totalQty;
  if (count) count.textContent = totalQty;

  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  if (!cart.length) {
    itemsEl.innerHTML = '';
    itemsEl.appendChild(emptyEl);
    emptyEl.style.display = 'block';
    footerEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  footerEl.style.display = 'block';
  if (totalEl) totalEl.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img"><img src="${item.img}" alt="${item.name}" /></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">${item.category}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕ Remove</button>
      </div>
    </div>
  `).join('');
}

// ---- TOAST ----
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ---- CHATBOT ----
function initChatbot() {
  const toggle = document.getElementById('chatbotToggle');
  const panel = document.getElementById('chatbotPanel');
  const minimize = document.getElementById('chatbotMinimize');
  const badge = document.getElementById('chatbotBadge');
  const input = document.getElementById('chatInput');

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    document.querySelector('.chatbot-icon-open').style.display = isOpen ? 'none' : 'block';
    document.querySelector('.chatbot-icon-close').style.display = isOpen ? 'block' : 'none';
    if (badge) badge.style.display = 'none';
  });

  minimize.addEventListener('click', () => {
    panel.classList.remove('open');
    document.querySelector('.chatbot-icon-open').style.display = 'block';
    document.querySelector('.chatbot-icon-close').style.display = 'none';
  });

  if (input) {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } });
  }
}

function setApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (!key || !key.startsWith('sk-')) { showToast('⚠️ Enter a valid OpenAI API key'); return; }
  apiKey = key;
  document.getElementById('apiKeySection').style.display = 'none';
  document.getElementById('chatInputRow').style.display = 'flex';
  document.getElementById('chatInput').focus();
  showToast('✅ AI Assistant activated!');
  addBotMessage("I'm activated! Ask me about our collection, styling tips, sizing, or anything else. 👗✨");
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  addUserMessage(msg);
  showTyping();

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', max_tokens: 200,
        messages: [
          { role: 'system', content: `You are a helpful AI fashion assistant for DRAPE, a premium Indian fashion store. Products: Dresses (₹1299-₹1799), Tops (₹699-₹999), Kurtas (₹1199-₹1499), Co-ords (₹2199-₹2799). Free shipping above ₹1999. 15-day returns. Code DRAPE10 for 10% off. Be warm and concise, use fashion emojis. Max 80 words.` },
          ...chatHistory,
          { role: 'user', content: msg }
        ]
      })
    });
    const data = await res.json();
    removeTyping();
    if (data.error) { addBotMessage(`⚠️ ${data.error.message}`); return; }
    const reply = data.choices?.[0]?.message?.content || "Can I help you find the perfect outfit?";
    chatHistory.push({ role: 'user', content: msg }, { role: 'assistant', content: reply });
    if (chatHistory.length > 16) chatHistory = chatHistory.slice(-16);
    addBotMessage(reply);
  } catch(err) {
    removeTyping();
    addBotMessage("Connection issue. Please check your API key. 🙏");
  }
}

function sendSuggestion(text) {
  document.getElementById('chatInput').value = text;
  document.querySelector('.chat-suggestions')?.remove();
  sendMessage();
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatbotMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `<div class="chat-bubble">${text.replace(/</g,'&lt;')}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addBotMessage(text) {
  const msgs = document.getElementById('chatbotMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.innerHTML = `<div class="chat-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatbotMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot'; div.id = 'typingIndicator';
  div.innerHTML = `<div class="chat-typing"><span></span><span></span><span></span></div>`;
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() { document.getElementById('typingIndicator')?.remove(); }

console.log('%c✦ DRAPE by Vaish — v2', 'font-size:16px;font-weight:bold;color:#c4956a;');
