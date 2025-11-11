# TODO: Remove Issues in RCR Coaching Site

## Steps to Complete

- [x] Update routes/pay.js: Remove default 'change_me' for RAZORPAY_WEBHOOK_SECRET, make it required from env.
- [x] Add endpoint in routes/pay.js: Create /api/pay/key to serve Razorpay key securely.
- [x] Update public/index.html: Remove hardcoded test key from meta tag.
- [x] Update public/app.js: Fetch Razorpay key from new server endpoint instead of meta tag.
- [x] Create .env.example: With proper placeholders for all env vars.
- [x] Update README.md: Remove 'change_me' placeholders and update instructions.
- [x] Test payment flow: Server running, health check ok, key endpoint returns key (note: using test key from .env).
- [x] Thorough testing: Auth register/login work, payment order creation successful, webhook properly requires secret, HTML serves correctly without hardcoded key.

# TODO: Add New Courses

## Steps to Complete

- [x] Update COURSE_LIST in public/app.js: Add new courses for Chemistry, Physics, Biology, Math, 10th Science.
- [x] Test the site: Run server and verify new courses appear in the courses section.
