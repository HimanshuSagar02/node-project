const API = window.location.origin;

const COURSE_LIST = [
  { 
    id: 'c4', 
    title: 'Class 10th Science Booster', 
    description: 'Comprehensive coverage of Physics, Chemistry, and Biology for 10th grade board exams with PYQs and practice sessions.', 
    price: 251, 
    image: '/rcr1.jpg' 
  },
  { 
    id: 'c12', 
    title: 'Class 10th Maths Fundamentals', 
    description: 'Master essential Maths topics including algebra, geometry, and trigonometry with step-by-step guidance.', 
    price: 251, 
    image: '/rcr1.jpg' 
  },
  { 
    id: 'c5', 
    title: 'Class 12th Chemistry ', 
    description: 'In-depth Chemistry course with organic, inorganic, and physical chemistry topics, mock tests, and doubt sessions.', 
    price: 251, 
    image: '/rcr1.jpg' 
  },
  { 
    id: 'c6', 
    title: 'Class 12th Physics ', 
    description: 'Detailed Physics course covering mechanics, optics, electricity, and modern physics with practical examples.', 
    price: 251, 
    image: '/rcr1.jpg' 
  },
  { 
    id: 'c7', 
    title: 'Class 12th Biology ', 
    description: 'Complete Biology syllabus including botany, zoology, genetics, and ecology with interactive sessions.', 
    price: 251, 
    image: '/rcr1.jpg' 
  },
  { 
    id: 'c8', 
    title: 'Class 12th Maths ', 
    description: 'Advanced Maths course with calculus, algebra, geometry, and statistics for board exam success.', 
    price: 251, 
    image: '/rcr1.jpg' 
  }
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
    el.className = 'card course-card rounded-3xl p-5';
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
