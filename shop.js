'use strict';

/* ============================================
   DRAPE — STORE JAVASCRIPT
   Features: Products, Cart, Filters, AI Chatbot
   ============================================ */

// ---- PRODUCT DATA ----
const PRODUCTS = [
  {
    id: 1, name: "Bloom Wrap Dress", category: "dresses",
    price: 1799, mrp: 2499, discount: 28,
    emoji: "👗", badge: "new", sizes: ["XS","S","M","L","XL"],
    color: "linear-gradient(160deg, #f0e6f6, #d4a8e8)",
    desc: "Floral wrap dress perfect for summer outings."
  },
  {
    id: 2, name: "Sunset Midi Dress", category: "dresses",
    price: 2199, mrp: 2999, discount: 27,
    emoji: "🌸", badge: "sale", sizes: ["S","M","L"],
    color: "linear-gradient(160deg, #fce8e8, #f4a8a8)",
    desc: "Flowy midi dress in warm terracotta tones."
  },
  {
    id: 3, name: "Linen Breezy Top", category: "tops",
    price: 899, mrp: 1299, discount: 31,
    emoji: "👚", badge: "new", sizes: ["XS","S","M","L","XL","XXL"],
    color: "linear-gradient(160deg, #e6f0f6, #a8cce8)",
    desc: "Lightweight linen top, perfect for layering."
  },
  {
    id: 4, name: "Ethnic Chikankari Kurta", category: "kurtas",
    price: 1499, mrp: 1999, discount: 25,
    emoji: "🪷", badge: "new", sizes: ["S","M","L","XL"],
    color: "linear-gradient(160deg, #f6f0e6, #e8cca8)",
    desc: "Hand-crafted chikankari embroidery on soft cotton."
  },
  {
    id: 5, name: "Pastel Co-ord Set", category: "coords",
    price: 2499, mrp: 3499, discount: 29,
    emoji: "🌿", badge: "sale", sizes: ["XS","S","M","L"],
    color: "linear-gradient(160deg, #e6f6ee, #a8e8c4)",
    desc: "Matching top and trouser set in sage green."
  },
  {
    id: 6, name: "Boho Printed Dress", category: "dresses",
    price: 1599, mrp: 2199, discount: 27,
    emoji: "🌼", badge: null, sizes: ["S","M","L","XL"],
    color: "linear-gradient(160deg, #fef6e4, #f4d03f55)",
    desc: "Bohemian-inspired printed maxi dress."
  },
  {
    id: 7, name: "Striped Crop Top", category: "tops",
    price: 699, mrp: 999, discount: 30,
    emoji: "🎀", badge: "sale", sizes: ["XS","S","M","L"],
    color: "linear-gradient(160deg, #fff0f3, #fca5b8)",
    desc: "Classic navy & white striped crop top."
  },
  {
    id: 8, name: "Block Print Kurta", category: "kurtas",
    price: 1299, mrp: 1799, discount: 28,
    emoji: "🪭", badge: "new", sizes: ["S","M","L","XL","XXL"],
    color: "linear-gradient(160deg, #fdebd0, #e59866)",
    desc: "Rajasthani block print kurta with mirror work."
  },
  {
    id: 9, name: "Rust Linen Co-ord", category: "coords",
    price: 2799, mrp: 3999, discount: 30,
    emoji: "🍂", badge: "new", sizes: ["XS","S","M","L"],
    color: "linear-gradient(160deg, #f6ece6, #e8b09a)",
    desc: "Earthy rust linen set — weekend perfection."
  },
  {
    id: 10, name: "Floral Anarkali", category: "dresses",
    price: 2999, mrp: 4499, discount: 33,
    emoji: "💐", badge: "sale", sizes: ["S","M","L","XL"],
    color: "linear-gradient(160deg, #f0f6e6, #b4d89a)",
    desc: "Elegant anarkali with delicate floral print."
  },
  {
    id: 11, name: "Off-Shoulder Blouse", category: "tops",
    price: 999, mrp: 1399, discount: 29,
    emoji: "✨", badge: null, sizes: ["XS","S","M","L"],
    color: "linear-gradient(160deg, #f0eaf6, #c3a8e0)",
    desc: "Off-shoulder blouse with ruffled sleeves."
  },
  {
    id: 12, name: "Straight Kurti Set", category: "kurtas",
    price: 1199, mrp: 1699, discount: 29,
    emoji: "🌺", badge: null, sizes: ["S","M","L","XL","XXL"],
    color: "linear-gradient(160deg, #eaf6f0, #a8d8c0)",
    desc: "Straight-cut kurti with palazzo — daily wear."
  }
];

// ---- STATE ----
let cart = JSON.parse(localStorage.getItem('drape_cart') || '[]');
let apiKey = '';
let chatHistory = [];
let currentFilter = 'all';

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(PRODUCTS);
  updateCartUI();
  initHeader();
  initCart();
  initChatbot();
  initSearch();
});

// ---- HEADER SCROLL ----
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
  if (bar.classList.contains('open')) {
    document.getElementById('searchInput').focus();
  }
}

function initSearch() {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
    renderProducts(filtered);
    document.getElementById('productsLabel').textContent = q ? `Search: "${e.target.value}"` : 'All Products';
  });
}

// ---- PRODUCTS ----
function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--gray-400)">
      <div style="font-size:3rem; margin-bottom:12px">🔍</div>
      <p style="font-family:var(--font-display); font-size:1.4rem; margin-bottom:8px">No results found</p>
      <p style="font-size:0.9rem">Try a different search or browse our categories.</p>
    </div>`;
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="product-card" data-category="${p.category}" data-id="${p.id}">
      <div class="product-img-wrap">
        <div class="product-img-placeholder" style="background: ${p.color}">
          <span style="font-size:3.5rem">${p.emoji}</span>
        </div>
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === 'new' ? 'New' : 'Sale'}</span>` : ''}
        <button class="product-wishlist" onclick="toggleWishlist(this, ${p.id})" aria-label="Wishlist">🤍</button>
        <button class="product-quick-add" onclick="addToCart(${p.id})">
          + Add to Bag
        </button>
      </div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-pricing">
          <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
          ${p.mrp ? `<span class="product-mrp">₹${p.mrp.toLocaleString('en-IN')}</span>` : ''}
          ${p.discount ? `<span class="product-discount">${p.discount}% off</span>` : ''}
        </div>
        <div class="product-sizes">
          ${p.sizes.map(s => `<div class="size-dot" onclick="selectSize(this, ${p.id})">${s}</div>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(category, btn) {
  currentFilter = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const filtered = category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
  renderProducts(filtered);

  const label = document.getElementById('productsLabel');
  if (label) label.textContent = category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1);

  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function filterByCategory(cat) {
  filterProducts(cat, document.querySelector(`[data-filter="${cat}"]`));
}

function selectSize(el, productId) {
  const card = el.closest('.product-card');
  card.querySelectorAll('.size-dot').forEach(d => d.classList.remove('selected'));
  el.classList.add('selected');
}

function toggleWishlist(btn, productId) {
  const isLiked = btn.classList.toggle('liked');
  btn.textContent = isLiked ? '❤️' : '🤍';
  showToast(isLiked ? 'Added to wishlist ❤️' : 'Removed from wishlist');
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
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

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
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Count bubble
  const indicator = document.getElementById('cartIndicator');
  const count = document.getElementById('cartCount');
  if (totalQty > 0) {
    indicator.style.display = 'flex';
    indicator.textContent = totalQty;
  } else {
    indicator.style.display = 'none';
  }
  if (count) count.textContent = totalQty;

  // Cart items
  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  if (!cart.length) {
    emptyEl.style.display = 'block';
    footerEl.style.display = 'none';
    itemsEl.innerHTML = '';
    itemsEl.appendChild(emptyEl);
    return;
  }

  emptyEl.style.display = 'none';
  footerEl.style.display = 'block';
  if (totalEl) totalEl.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img" style="background:${item.color}">
        <span style="font-size:1.6rem">${item.emoji}</span>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Size: M &nbsp;·&nbsp; ${item.category}</div>
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
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
}

function setApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (!key || !key.startsWith('sk-')) {
    showToast('⚠️ Please enter a valid OpenAI API key (starts with sk-)');
    return;
  }
  apiKey = key;
  document.getElementById('apiKeySection').style.display = 'none';
  document.getElementById('chatInputRow').style.display = 'flex';
  document.getElementById('chatInput').focus();
  showToast('✅ AI Assistant activated!');
  addBotMessage("I'm now fully activated! Ask me about our latest collections, sizing, styling tips, or anything else fashion-related. 👗✨");
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  input.value = '';
  addUserMessage(msg);
  showTyping();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: `You are a helpful and stylish AI fashion assistant for DRAPE, a premium Indian fashion store. 
            You help customers with:
            - Finding the right outfit for occasions
            - Sizing and fit advice  
            - Style and outfit pairing tips
            - Information about our products (dresses, tops, kurtas, co-ords)
            - Shipping (free above ₹1999), returns (15 days), payment (secure)
            - Our promo code DRAPE10 for 10% off
            
            Our products range from ₹699 to ₹2999. Be warm, enthusiastic, and concise. Use occasional fashion emojis.
            Keep responses under 100 words. Always try to suggest a relevant product category when appropriate.`
          },
          ...chatHistory,
          { role: 'user', content: msg }
        ]
      })
    });

    const data = await response.json();
    removeTyping();

    if (data.error) {
      addBotMessage(`⚠️ ${data.error.message || 'Something went wrong. Please check your API key.'}`);
      return;
    }

    const reply = data.choices?.[0]?.message?.content || "I'm not sure about that. Can I help you find the perfect outfit instead?";
    chatHistory.push({ role: 'user', content: msg });
    chatHistory.push({ role: 'assistant', content: reply });
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

    addBotMessage(reply);
  } catch (err) {
    removeTyping();
    addBotMessage("I'm having trouble connecting right now. Please check your API key or try again. 🙏");
  }
}

function sendSuggestion(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
  // Remove suggestions after first use
  document.querySelector('.chat-suggestions')?.remove();
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatbotMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
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
  div.className = 'chat-msg bot';
  div.id = 'typingIndicator';
  div.innerHTML = `<div class="chat-typing"><span></span><span></span><span></span></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  document.getElementById('typingIndicator')?.remove();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

console.log('%c✦ DRAPE Fashion Store', 'font-size:16px; font-weight:bold; color:#c4956a;');
console.log('%cBuilt with ❤️ by your developer', 'color:#8a8178; font-size:12px;');
