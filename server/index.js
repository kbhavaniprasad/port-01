require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');

// Fix for Node.js DNS resolution issues on Windows (ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.log('DNS setServers failed:', err);
}

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors({ 
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',
    'https://portfolio-frontend-rzmx.onrender.com',
    'https://port-01-frontend.onrender.com',
    'https://port-01.onrender.com',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for IP addresses
app.set('trust proxy', true);

// ===== DB SETUP =====
mongoose.connect(process.env.MONGO_URI, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
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
  emailSent: { type: Boolean, default: false },
  emailError: { type: String, default: null },
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

// ===== ENHANCED NODEMAILER TRANSPORT =====
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

let transporter = createTransporter();

// Enhanced transporter verification with retry
const verifyTransporter = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await transporter.verify();
      console.log('✅ Email transporter ready and verified');
      return true;
    } catch (error) {
      console.error(`❌ Email transporter verification attempt ${i + 1} failed:`, error);
      
      if (i === retries - 1) {
        console.log('📧 Email configuration details:');
        console.log('   EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
        console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
        console.log('   Make sure EMAIL_PASS is an app password, not your regular password');
        return false;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

// Verify transporter on startup
verifyTransporter();

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

// ===== ENHANCED CONTACT FORM ENDPOINT =====
app.post('/api/send-email', async (req, res) => {
  let messageId = null;
  
  try {
    const { name, email, message } = req.body;
    
    console.log('📧 Contact form submission received:', { name, email, messageLength: message?.length });
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    // Save to database first
    const newMessage = new Message({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    });
    
    const savedMessage = await newMessage.save();
    messageId = savedMessage._id;
    console.log('✅ Message saved to database with ID:', messageId);

    // Prepare email content
    const mailOptions = {
      from: {
        name: 'Portfolio Contact Form',
        address: process.env.EMAIL_USER
      },
      to: process.env.EMAIL_USER, // Send to owner
      replyTo: email, // Allow owner to reply directly to sender
      subject: `🚀 New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">New Contact Form Submission</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #555; width: 80px;">Name:</td>
                  <td style="padding: 10px; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #555;">Email:</td>
                  <td style="padding: 10px;">
                    <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
                  <td style="padding: 10px; color: #333; line-height: 1.5;">
                    ${message.replace(/\n/g, '<br>')}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">
              📧 This email was sent from your portfolio contact form | 
              ⏰ Received: ${new Date().toLocaleString()} |
              🆔 Message ID: ${messageId}
            </p>
          </div>
        </div>
      `
    };

    console.log('📤 Attempting to send email...');
    
    // Send email notification with retry logic
    let emailSent = false;
    let emailError = null;
    
    try {
      const emailResult = await transporter.sendMail(mailOptions);
      console.log('✅ Email notification sent successfully:', emailResult.messageId);
      emailSent = true;
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      emailError = emailError.message;
      
      // Try to recreate transporter and retry once
      console.log('🔄 Attempting to recreate transporter and retry...');
      transporter = createTransporter();
      
      try {
        const retryResult = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully on retry:', retryResult.messageId);
        emailSent = true;
        emailError = null;
      } catch (retryError) {
        console.error('❌ Email retry also failed:', retryError);
        emailError = `Initial: ${emailError}, Retry: ${retryError.message}`;
      }
    }

    // Update message with email status
    await Message.findByIdAndUpdate(messageId, {
      emailSent,
      emailError
    });

    // Log the contact form submission
    const logEntry = new LogEntry({
      event: 'contact_form_submission',
      data: { 
        name, 
        email, 
        messageLength: message.length,
        emailSent,
        emailError,
        messageId 
      },
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent'),
      url: req.get('Referer') || 'unknown'
    });
    await logEntry.save();

    if (emailSent) {
      res.json({ 
        success: true, 
        message: 'Message sent successfully! I\'ll get back to you soon.' 
      });
    } else {
      // Still return success but log the email failure
      console.warn('⚠️ Message saved but email notification failed');
      res.json({ 
        success: true, 
        message: 'Message received! (Email notification failed, but your message was saved)' 
      });
    }

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    // Update message with error if we have the ID
    if (messageId) {
      await Message.findByIdAndUpdate(messageId, {
        emailSent: false,
        emailError: error.message
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again or contact me directly at kolaprasad001@gmail.com' 
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

// ===== EMAIL STATUS ENDPOINT =====
app.get('/api/email-status', async (req, res) => {
  try {
    const stats = await Message.aggregate([
      {
        $group: {
          _id: '$emailSent',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalMessages = await Message.countDocuments();
    const failedEmails = await Message.countDocuments({ emailSent: false });
    
    res.json({
      success: true,
      stats: {
        totalMessages,
        emailsSent: totalMessages - failedEmails,
        emailsFailed: failedEmails,
        details: stats
      }
    });
  } catch (error) {
    console.error('❌ Error fetching email stats:', error);
    res.status(500).json({ error: 'Failed to fetch email statistics' });
  }
});

// ===== HEALTH CHECK ENDPOINT =====
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ===== TEST EMAIL ENDPOINT =====
app.post('/api/test-email', async (req, res) => {
  try {
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '🧪 Portfolio Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #667eea;">Portfolio Email Test</h2>
          <p>This is a test email from your portfolio backend.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            If you received this email, your email configuration is working correctly! 🎉
          </p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(testMailOptions);
    console.log('✅ Test email sent:', result.messageId);
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully!',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Test email failed: ' + error.message 
    });
  }
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
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 CORS enabled for multiple origins`);
});