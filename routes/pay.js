const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Get Razorpay key
router.get('/key', (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) return res.status(500).json({ message: 'Razorpay key not configured' });
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// Create order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency: 'INR',
      receipt: receipt || 'rcpt_' + Date.now()
    });
    res.json({ order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Payment order error' });
  }
});

// Optional webhook signature verification endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return res.status(500).json({ status: 'webhook secret not configured' });
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(req.body.toString());
  const digest = shasum.digest('hex');
  if (signature === digest) {
    console.log('Webhook verified:', req.body.toString());
    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ status: 'invalid signature' });
  }
});

module.exports = router;
