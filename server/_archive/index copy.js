require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors({ 
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'https://portfolio-frontend-rzmx.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for IP addresses
app.set('trust proxy', true);

// ===== DB SETUP =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// ===== SCHEMAS =====
const Message = mongoose.model("Message", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

const LogEntry = mongoose.model("LogEntry", new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  sessionId: String,
  event: String,
  data: mongoose.Schema.Types.Mixed,
  url: String,
  userAgent: String,
  ip: String
}));

// ===== NODEMAILER TRANSPORT =====
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // This should be your app password
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
    console.log('📧 Make sure EMAIL_USER and EMAIL_PASS are set in .env file');
    console.log('📧 EMAIL_PASS should be an app password, not your regular password');
  } else {
    console.log('✅ Email transporter ready');
  }
});

// ===== LOGGING ENDPOINT =====
app.post('/api/log', async (req, res) => {
  try {
    const logEntry = new LogEntry({
      ...req.body,
      ip: req.ip || req.connection.remoteAddress || 'unknown'
    });
    await logEntry.save();
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Logging error:', error);
    res.status(500).json({ error: 'Logging failed' });
  }
});

// ===== GET LOGS ENDPOINT (for analytics) =====
app.get('/api/logs', async (req, res) => {
  try {
    const { event, limit = 100, startDate, endDate } = req.query;
    
    let query = {};
    if (event) query.event = event;
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const logs = await LogEntry.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, logs });
  } catch (error) {
    console.error('❌ Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// ===== CONTACT FORM ENDPOINT =====
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    // Save to database
    const newMessage = new Message({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });
    
    await newMessage.save();
    console.log('✅ Message saved to database');

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Received at: ${new Date().toLocaleString()}</small></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email notification sent');

    // Log the contact form submission
    const logEntry = new LogEntry({
      event: 'contact_form_submission',
      data: { name, email, messageLength: message.length },
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent'),
      url: req.get('Referer') || 'unknown'
    });
    await logEntry.save();

    res.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again.' 
    });
  }
});

// ===== GET MESSAGES ENDPOINT (for admin) =====
app.get('/api/messages', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Message.countDocuments();
    
    res.json({ 
      success: true, 
      messages, 
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: messages.length,
        totalMessages: total
      }
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ===== HEALTH CHECK ENDPOINT =====
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===== ERROR HANDLING MIDDLEWARE =====
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// ===== 404 HANDLER =====
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'configured' : 'not configured'}`);
  console.log(`🗄️  Database: ${process.env.MONGO_URI ? 'configured' : 'not configured'}`);
  console.log(`🌐 CORS enabled for: localhost:3000, localhost:3001, portfolio-frontend-rzmx.onrender.com`);
});

