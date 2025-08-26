/* Enhanced Shopping Cart System */

document.addEventListener('DOMContentLoaded', () => {
  // Cart Management
  const CART_KEY = 'fanshy_cart_v2';
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  // Initialize cart
  function initCart() {
    updateCartUI();
    if (window.location.pathname.includes('cart.html')) {
      renderCartPage();
    }
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
  }

  // Update cart UI across all pages
  function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElements = document.querySelectorAll('#cartCount, #cartCount2');
    countElements.forEach(el => el.textContent = totalQty);
    
    // Update cart summary if on menu page
    const summary = document.getElementById('cartSummary');
    if (summary) {
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      summary.textContent = `${totalQty} صنف - ${totalPrice} ج.م`;
    }
  }

  // Add item to cart
  function addToCart(name, price, image = null) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: Date.now(),
        name: name,
        price: price,
        quantity: 1,
        image: image
      });
    }
    
    saveCart();
    showNotification(`${name} تمت إضافته للسلة`);
  }

  // Remove item from cart
  function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    if (window.location.pathname.includes('cart.html')) {
      renderCartPage();
    }
  }

  // Update item quantity
  function updateQuantity(itemId, newQuantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      if (newQuantity <= 0) {
        removeFromCart(itemId);
      } else {
        item.quantity = newQuantity;
        saveCart();
        if (window.location.pathname.includes('cart.html')) {
          renderCartPage();
        }
      }
    }
  }

  // Show notification
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  // Render cart page
  function renderCartPage() {
    const cartItemsContainer = document.getElementById('cartItems');
    const checkoutForm = document.getElementById('checkoutForm');
    const orderConfirmation = document.getElementById('orderConfirmation');
    
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>السلة فارغة</h3>
          <p>لم تقم بإضافة أي منتجات إلى السلة بعد</p>
          <a href="menu.html" class="btn primary">تصفح القائمة</a>
        </div>
      `;
      updateCartSummary(0, 0, 0);
      return;
    }

    // Render cart items
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image || 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=200&auto=format&fit=crop'}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${item.price} ج.م</div>
          </div>
          <div class="cart-item-controls">
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
          </div>
        </div>
      </div>
    `).join('');

    // Update summary
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 200 ? 0 : 20;
    const total = subtotal + deliveryFee;
    
    updateCartSummary(cart.length, subtotal, deliveryFee, total);
  }

  // Update cart summary
  function updateCartSummary(itemCount, subtotal, deliveryFee, total) {
    const totalItems = document.getElementById('totalItems');
    const subtotalEl = document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('deliveryFee');
    const totalAmount = document.getElementById('totalAmount');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (totalItems) totalItems.textContent = itemCount;
    if (subtotalEl) subtotalEl.textContent = `${subtotal} ج.م`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = deliveryFee === 0 ? 'مجاني' : `${deliveryFee} ج.م`;
    if (totalAmount) totalAmount.textContent = `${total} ج.م`;
    if (checkoutBtn) {
      checkoutBtn.disabled = itemCount === 0;
    }
  }

  // Checkout process
  function startCheckout() {
    const cartContainer = document.querySelector('.cart-container');
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (cartContainer && checkoutForm) {
      cartContainer.style.display = 'none';
      checkoutForm.style.display = 'block';
    }
  }

  // Back to cart
  function backToCart() {
    const cartContainer = document.querySelector('.cart-container');
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (cartContainer && checkoutForm) {
      cartContainer.style.display = 'grid';
      checkoutForm.style.display = 'none';
    }
  }

  // Submit order
  function submitOrder(orderData) {
    const orderNumber = 'FAN' + Date.now();
    const order = {
      orderNumber: orderNumber,
      items: cart,
      customer: orderData,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      deliveryFee: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) >= 200 ? 0 : 20,
      timestamp: new Date().toISOString()
    };

    // Save order to localStorage (in real app, send to server)
    const orders = JSON.parse(localStorage.getItem('fanshy_orders') || '[]');
    orders.push(order);
    localStorage.setItem('fanshy_orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    saveCart();

    // Show confirmation
    showOrderConfirmation(orderNumber);
  }

  // Show order confirmation
  function showOrderConfirmation(orderNumber) {
    const checkoutForm = document.getElementById('checkoutForm');
    const orderConfirmation = document.getElementById('orderConfirmation');
    const orderNumberEl = document.getElementById('orderNumber');
    
    if (checkoutForm) checkoutForm.style.display = 'none';
    if (orderConfirmation) {
      orderConfirmation.style.display = 'block';
      if (orderNumberEl) orderNumberEl.textContent = orderNumber;
    }
  }

  // Event Listeners
  function setupEventListeners() {
    // Mobile navigation
    const mobileToggle = document.getElementById('mobileToggle') || document.getElementById('mobileToggle2');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileToggle && mobileNav) {
      mobileToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
      });
    }

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const itemEl = e.target.closest('.menu-item');
        if (itemEl) {
          const name = itemEl.dataset.name || itemEl.querySelector('h3')?.textContent || 'صنف';
          const price = Number(itemEl.dataset.price || itemEl.querySelector('.price')?.textContent.replace(/[^\d]/g, '') || 0);
          const image = itemEl.querySelector('img')?.src;
          addToCart(name, price, image);
        }
      });
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', startCheckout);
    }

    // Back to cart button
    const backToCartBtn = document.getElementById('backToCart');
    if (backToCartBtn) {
      backToCartBtn.addEventListener('click', backToCart);
    }

    // Order form
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
      orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(orderForm);
        const orderData = Object.fromEntries(formData.entries());
        submitOrder(orderData);
      });
    }

    // Cart button navigation
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        if (cart.length > 0) {
          window.location.href = 'cart.html';
        } else {
          showNotification('السلة فارغة');
        }
      });
    }
  }

  // Menu category filtering
  function setupMenuFiltering() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        // Update active button
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show/hide categories
        menuCategories.forEach(cat => {
          if (category === 'all' || cat.dataset.category === category) {
            cat.style.display = 'block';
            cat.style.animation = 'fadeInUp 0.5s ease';
          } else {
            cat.style.display = 'none';
          }
        });
      });
    });
  }

  // Contact form handling
  function setupContactForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cf-name')?.value;
        const phone = document.getElementById('cf-phone')?.value;
        const msg = document.getElementById('cf-msg')?.value;
        
        showNotification(`شكراً ${name}، تم استلام رسالتك. سنعاود الاتصال على ${phone}`);
        contactForm.reset();
      });
    }

    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
      reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('res-name')?.value;
        const phone = document.getElementById('res-phone')?.value;
        const date = document.getElementById('res-date')?.value;
        const time = document.getElementById('res-time')?.value;
        const guests = document.getElementById('res-guests')?.value;
        
        showNotification(`شكراً ${name}. تم استلام الحجز ${date} ${time} لعدد ${guests}. سنتصل على ${phone} للتأكيد.`);
        reservationForm.reset();
      });
    }
  }

  // Initialize everything
  function init() {
    initCart();
    setupEventListeners();
    setupMenuFiltering();
    setupContactForms();
  }

  // Make functions globally available
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateQuantity = updateQuantity;
  window.startCheckout = startCheckout;
  window.backToCart = backToCart;

  // Start the application
  init();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
