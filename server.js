const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// static frontend
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pay', require('./routes/pay'));

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// connect DB and start
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server running on port', PORT));
  } catch (e) {
    console.error('Startup error', e);
    process.exit(1);
  }
}

start();
