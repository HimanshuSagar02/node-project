# Raj Chem Reactor Coaching — Yellow/Black Full-Stack Sample

Features:
- Home page with header, footer, course cards, and login/signup modal
- MongoDB auth (register/login) with hashed passwords & JWT cookie
- Razorpay payment (create order on backend; pay via Checkout)
- Tailwind-based yellow/black UI

## Quick Start

1) Install Node 18+ and MongoDB Atlas (or local).
2) Copy `.env.example` to `.env` and fill values:
   ```env
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
   PORT=5000
   ```
3) Install deps and run:
   ```bash
   npm install
   npm run dev
   ```
4) Open http://localhost:5000

### Notes
- The Razorpay key is now securely fetched from the server at `/api/pay/key`.
- For production, serve over HTTPS for Razorpay Checkout and secure cookies.
- Add real course data in DB if desired (a Course model is included). Currently courses are hardcoded on the frontend.
- Optional: implement Razorpay webhook at `/api/pay/webhook` and set `RAZORPAY_WEBHOOK_SECRET`.
