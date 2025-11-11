const API = window.location.origin;

const COURSE_LIST = [
  { id: 'c1', title: 'Class 10th Maths Booster', description: 'Complete syllabus coverage with PYQs, practice tests, and doubt clearing sessions. Ideal for board exam preparation.', price: 251, image: '/rcr1.jpg' },
  { id: 'c2', title: 'Class 12th PCM Crash Course', description: 'Intensive crash course covering Physics, Chemistry, and Maths with focused study materials and mock tests.', price: 251, image: '/rcr1.jpg' },
  { id: 'c3', title: 'Class 12th PCB Crash Course', description: 'Comprehensive crash course for Physics, Chemistry, and Biology with expert guidance and assessment tools.', price: 251, image: '/rcr1.jpg' }
];

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Modal logic
const authModal = document.getElementById('authModal');
const openLogin = document.getElementById('openLogin');
const ctaLogin = document.getElementById('ctaLogin');
const closeModal = document.getElementById('closeModal');
const tabLogin = document.getElementById('tabLogin');
const tabSignup = document.getElementById('tabSignup');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

function showModal() { authModal.classList.remove('hidden'); authModal.classList.add('flex'); }
function hideModal() { authModal.classList.add('hidden'); authModal.classList.remove('flex'); }
if (openLogin) openLogin.addEventListener('click', showModal);
if (ctaLogin) ctaLogin.addEventListener('click', showModal);
if (closeModal) closeModal.addEventListener('click', hideModal);

if (tabLogin) tabLogin.addEventListener('click', () => { loginForm.classList.remove('hidden'); signupForm.classList.add('hidden'); });
if (tabSignup) tabSignup.addEventListener('click', () => { signupForm.classList.remove('hidden'); loginForm.classList.add('hidden'); });

// Render courses
const grid = document.getElementById('courseGrid');
if (grid) {
  COURSE_LIST.forEach(c => {
    const el = document.createElement('div');
    el.className = 'card rounded-3xl p-5';
    el.innerHTML = `
      <div class="h-40 bg-black rounded-2xl border border-yellow-900 mb-4 flex items-center justify-center overflow-hidden">
        <img src="${c.image}" alt="${c.title}" class="w-full h-full object-cover">
      </div>
      <h4 class="text-xl font-bold mb-2">${c.title}</h4>
      <p class="text-gray-300 text-sm leading-relaxed mb-4">${c.description}</p>
      <div class="mt-auto flex items-center justify-between">
        <span class="font-extrabold text-yellow-400 text-lg">₹${c.price}</span>
        <button class="rcr-btn px-5 py-2 rounded-2xl" data-id="${c.id}">Buy Now</button>
      </div>`;
    grid.appendChild(el);
  });

  grid.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-id]');
    if (!btn) return;
    const course = COURSE_LIST.find(x => x.id === btn.dataset.id);
    if (!course) return;

    // Create Razorpay order
    const res = await fetch('/api/pay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: course.price, receipt: course.id + '-' + Date.now() })
    });
    const data = await res.json();
    if (!data.order) { alert('Payment init failed'); return; }

    if (!razorpayKey) { alert('Payment key not loaded'); return; }
    const options = {
      key: razorpayKey,
      amount: data.order.amount,
      currency: 'INR',
      name: 'RCR Coaching',
      description: course.title,
      order_id: data.order.id,
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
      },
      prefill: {},
      theme: { color: '#FFC300' }
    };
    const rzp = new Razorpay(options);
    rzp.open();
  });
}

// Fetch Razorpay key from server
let razorpayKey = null;
async function loadRazorpayKey() {
  try {
    const res = await fetch('/api/pay/key');
    const data = await res.json();
    if (res.ok) razorpayKey = data.key;
  } catch (e) {
    console.error('Failed to load Razorpay key:', e);
  }
}
loadRazorpayKey();

// Auth
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(loginForm);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    const data = await res.json();
    if (res.ok) {
      alert('Welcome ' + (data.user?.name || ''));
      hideModal();
    } else {
      alert(data.message || 'Login failed');
    }
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(signupForm);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    const data = await res.json();
    if (res.ok) {
      alert('Account created. Hello ' + (data.user?.name || ''));
      hideModal();
    } else {
      alert(data.message || 'Signup failed');
    }
  });
}
