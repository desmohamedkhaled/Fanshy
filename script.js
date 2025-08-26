/* Basic interactivity: mobile nav, cart (localStorage), forms (demo) */

document.addEventListener('DOMContentLoaded', ()=>{

  // mobile nav toggle
  const mobileToggle = document.getElementById('mobileToggle') || document.getElementById('mobileToggle2');
  const mobileNav = document.getElementById('mobileNav');
  if(mobileToggle){
    mobileToggle.addEventListener('click', ()=> {
      mobileNav.classList.toggle('hidden');
    });
  }

  // CART (simple in-memory + localStorage)
  const CART_KEY = 'fanshy_cart_v1';
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartUI(); }
  function updateCartUI(){
    const totalQty = cart.reduce((s,i)=>s+i.qty,0);
    const totalPrice = cart.reduce((s,i)=>s + i.qty * i.price,0);
    const countEls = document.querySelectorAll('#cartCount, #cartCount2');
    countEls.forEach(el=>el.textContent = totalQty);
    const summary = document.getElementById('cartSummary');
    if(summary) summary.textContent = `${totalQty} صنف - ${totalPrice} ج.م`;
  }

  // add-to-cart buttons (menu page)
  document.querySelectorAll('.add-to-cart').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const itemEl = e.target.closest('.menu-item');
      if(!itemEl) return;
      const name = itemEl.dataset.name || itemEl.querySelector('h3')?.textContent || 'صنف';
      const price = Number(itemEl.dataset.price || itemEl.querySelector('.price')?.textContent.replace(/[^\d]/g,'') || 0);
      addToCart(name, price);
    });
  });

  // generic addToCart for other pages
  window.addToCart = function(name, price){
    const existing = cart.find(i=>i.name===name);
    if(existing) existing.qty += 1; else cart.push({name, price, qty:1});
    saveCart();
    alert(name + ' تمت إضافته للسلة');
  }

  function addToCart(name, price){
    window.addToCart(name, price);
  }

  // view / checkout buttons
  const viewBtn = document.getElementById('viewCartBtn');
  if(viewBtn) viewBtn.addEventListener('click', ()=> showCartModal());
  const checkoutBtn = document.getElementById('checkoutBtn');
  if(checkoutBtn) checkoutBtn.addEventListener('click', ()=> checkout());

  function showCartModal(){
    if(cart.length === 0){ alert('السلة فارغة'); return; }
    let text = 'سلتك:\n';
    let total = 0;
    cart.forEach(i=>{ text += `${i.name} x${i.qty} - ${i.qty*i.price} ج.م\n`; total += i.qty*i.price;});
    text += '\nالمجموع: ' + total + ' ج.م';
    alert(text);
  }

  function checkout(){
    if(cart.length === 0){ alert('السلة فارغة'); return; }
    // For demo — you can replace this with actual checkout flow or POST to server
    let total = cart.reduce((s,i)=>s + i.qty*i.price,0);
    if(confirm('اكمل للدفع. المجموع: ' + total + ' ج.م')) {
      // simulate order submission
      cart = [];
      saveCart();
      alert('تم ارسال الطلب (تجريبي). سنتواصل معك قريباً.');
    }
  }

  // contact form handling (demo)
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      // demo: collect values
      const name = document.getElementById('cf-name').value;
      const phone = document.getElementById('cf-phone').value;
      const msg = document.getElementById('cf-msg').value;
      // In production: send to server via fetch('/api/contact', {method:'POST', body: JSON.stringify({...})})
      alert('شكراً ' + name + '، تم استلام رسالتك. سنعاود الاتصال على ' + phone);
      contactForm.reset();
    });
  }

  // reservation form
  const resForm = document.getElementById('reservationForm');
  if(resForm){
    resForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('res-name').value;
      const phone = document.getElementById('res-phone').value;
      const date = document.getElementById('res-date').value;
      const time = document.getElementById('res-time').value;
      const guests = document.getElementById('res-guests').value;
      alert(`شكراً ${name}. تم استلام الحجز ${date} ${time} لعدد ${guests}. سنتصل على ${phone} للتأكيد.`);
      resForm.reset();
    });
  }

  // init UI
  updateCartUI();

});
