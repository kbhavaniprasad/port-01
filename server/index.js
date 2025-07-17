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
  origin: ['http://localhost:3000', 'http://localhost:3001'],
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
});

// require('dotenv').config();
// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ===== MIDDLEWARE =====
// app.use(cors({ origin: 'http://localhost:3000' }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ===== DB SETUP =====
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log("✅ MongoDB connected"))
//   .catch(err => {
//     console.error("❌ MongoDB error:", err);
//     process.exit(1);
//   });

// // ===== MESSAGE SCHEMA =====
// const Message = mongoose.model("Message", new mongoose.Schema({
//   name: String,
//   email: String,
//   message: String,
//   createdAt: { type: Date, default: Date.now }
// }));

// // ===== NODEMAILER TRANSPORT =====
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // ======= API ROUTES =========
// app.post('/api/send-email', async (req, res) => {
//   const { name, email, message } = req.body;

//   if (!name || !email || !message) {
//     return res.status(400).json({ error: 'All fields required' });
//   }

//   try {
//     const newMessage = new Message({ name, email, message });
//     await newMessage.save();

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: process.env.EMAIL_USER,
//       subject: `Message from ${name}`,
//       text: message,
//       html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`
//     });

//     return res.json({ success: true, message: 'Message sent successfully' });
//   } catch (err) {
//     console.error("❌ Email failed:", err);
//     return res.status(500).json({ error: 'Email send failed' });
//   }
// });

// // ===== HEALTH CHECK =====
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', time: new Date().toISOString() });
// });

// // ===== SERVE REACT BUILD (AFTER /api ROUTES ONLY) =====
// app.use(express.static(path.join(__dirname, '../client/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// // ===== START SERVER =====
// app.listen(PORT, () => {
//   console.log(`🚀 Server started on http://localhost:${PORT}`);
// });






// require('dotenv').config();
// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // CORS configuration
// const allowedOrigins = [
//   "http://localhost:3000",
//   // Add your production domain here when you deploy
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// // Pre-flight requests
// app.options('*', cors());

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, '../client/build')));

// // MongoDB Connection
// const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://kolabhavaniprasad:bhavanikola@cluster.zis7u.mongodb.net/emailDB?retryWrites=true&w=majority";

// mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000
// })
// .then(() => console.log("MongoDB connected successfully"))
// .catch(err => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
// });

// // Message Schema
// const messageSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     message: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// const Message = mongoose.model("Message", messageSchema);

// // Email Configuration
// const createTransporter = () => {
//     return nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     });
// };

// let transporter;
// try {
//     transporter = createTransporter();
//     transporter.verify((error) => {
//         if (error) {
//             console.error('Mail transporter verification failed:', error);
//         } else {
//             console.log('Mail server is ready to send messages');
//         }
//     });
// } catch (error) {
//     console.error('Failed to create mail transporter:', error);
// }

// // Email Endpoint
// app.post('/api/send-email', async (req, res) => {
//     const { name, email, message } = req.body;
    
//     if (!name || !email || !message) {
//         return res.status(400).json({ 
//             error: "Validation failed",
//             details: "All fields (name, email, message) are required"
//         });
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         return res.status(400).json({ 
//             error: "Validation failed",
//             details: "Invalid email format"
//         });
//     }

//     try {
//         const newMessage = new Message({ name, email, message });
//         await newMessage.save();
//         console.log('Message saved to database:', newMessage._id);

//         const mailOptions = {
//             from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
//             to: process.env.EMAIL_USER,
//             replyTo: email,
//             subject: `New Message from ${name} (Portfolio)`,
//             text: `You have received a new message from your portfolio website:\n\n` +
//                   `Name: ${name}\n` +
//                   `Email: ${email}\n` +
//                   `Message: ${message}\n\n` +
//                   `This message was received at: ${new Date().toISOString()}`,
//             html: `
//                 <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//                     <h2 style="color: #333;">New Portfolio Message</h2>
//                     <p><strong>Name:</strong> ${name}</p>
//                     <p><strong>Email:</strong> ${email}</p>
//                     <p><strong>Message:</strong></p>
//                     <p style="white-space: pre-wrap; background: #f5f5f5; padding: 10px; border-radius: 5px;">${message}</p>
//                     <p style="color: #666; font-size: 0.9em; margin-top: 20px;">
//                         This message was received at: ${new Date().toLocaleString()}
//                     </p>
//                 </div>
//             `
//         };

//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully:', info.messageId);

//         return res.status(200).json({ 
//             success: true,
//             message: "Message sent successfully",
//             messageId: info.messageId,
//             dbId: newMessage._id
//         });

//     } catch (error) {
//         console.error('Error processing contact form:', error);
//         return res.status(500).json({ 
//             error: "Failed to process your message",
//             details: error.message
//         });
//     }
// });

// // Health check endpoint
// app.get('/api/health', async (req, res) => {
//     try {
//         await mongoose.connection.db.admin().ping();
//         return res.status(200).json({
//             status: 'healthy',
//             database: 'connected',
//             mail: transporter ? 'configured' : 'not configured',
//             timestamp: new Date().toISOString()
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status: 'unhealthy',
//             error: error.message,
//             database: 'disconnected'
//         });
//     }
// });

// // Handle React routing, return all requests to React app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Unhandled error:', err);
//     res.status(500).json({
//         error: "Internal server error",
//         message: err.message
//     });
// });

// // Start server
// const server = app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
//     console.log(`Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
//     console.log(`Mail service: ${transporter ? 'Configured' : 'Not configured'}`);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//     console.log('SIGTERM received. Shutting down gracefully...');
//     server.close(() => {
//         mongoose.connection.close(false, () => {
//             console.log('MongoDB connection closed');
//             process.exit(0);
//         });
//     });
// });

// process.on('SIGINT', () => {
//     console.log('SIGINT received. Shutting down gracefully...');
//     server.close(() => {
//         mongoose.connection.close(false, () => {
//             console.log('MongoDB connection closed');
//             process.exit(0);
//         });
//     });
// });




// require('dotenv').config();
// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // CORS configuration
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type']
// }));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB Connection
// const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://kolabhavaniprasad:bhavanikola@cluster.zis7u.mongodb.net/emailDB?retryWrites=true&w=majority";

// mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000
// })
// .then(() => console.log("MongoDB connected successfully"))
// .catch(err => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
// });

// // Message Schema
// const messageSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     message: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// const Message = mongoose.model("Message", messageSchema);

// // Email Configuration
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// // Verify transporter
// transporter.verify((error) => {
//     if (error) {
//         console.error('Mail transporter verification failed:', error);
//     } else {
//         console.log('Mail server is ready to send messages');
//     }
// });

// // Email Endpoint
// app.post('/api/send-email', async (req, res) => {
//     const { name, email, message } = req.body;
    
//     // Input validation
//     if (!name || !email || !message) {
//         return res.status(400).json({ 
//             error: "All fields are required",
//             details: "Please provide name, email, and message"
//         });
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         return res.status(400).json({ 
//             error: "Invalid email format",
//             details: "Please provide a valid email address"
//         });
//     }

//     try {
//         // Save to database
//         const newMessage = new Message({ name, email, message });
//         await newMessage.save();
//         console.log('Message saved to database:', newMessage._id);

//         // Email options
//         const mailOptions = {
//             from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
//             to: process.env.EMAIL_USER,
//             replyTo: email,
//             subject: `New Message from ${name} (Portfolio)`,
//             text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//             html: `
//                 <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//                     <h2 style="color: #333;">New Portfolio Message</h2>
//                     <p><strong>Name:</strong> ${name}</p>
//                     <p><strong>Email:</strong> ${email}</p>
//                     <p><strong>Message:</strong></p>
//                     <p style="white-space: pre-wrap; background: #f5f5f5; padding: 10px; border-radius: 5px;">${message}</p>
//                 </div>
//             `
//         };

//         // Send email
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.messageId);

//         return res.status(200).json({ 
//             success: true,
//             message: "Message sent successfully",
//             messageId: info.messageId
//         });

//     } catch (error) {
//         console.error('Error:', error);
//         return res.status(500).json({ 
//             error: "Failed to process your message",
//             details: error.message
//         });
//     }
// });

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//     res.status(200).json({
//         status: 'running',
//         database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
//         mail: transporter ? 'configured' : 'not configured'
//     });
// });

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, '../client/build')));

// // Handle React routing, return all requests to React app
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).json({ error: "Internal server error" });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });