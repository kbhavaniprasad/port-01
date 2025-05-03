//require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const axios=require("axios");
const mongoose=require("mongoose");

//const twilio = require("twilio");

const app = express();
const PORT =  5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: "https://port-01-frontend.onrender.com", 
    methods: ["GET", "POST"],
    credentials: true
}));

const MONGO_URI="mongodb+srv://kolabhavaniprasad:bhavanikola@cluster.zis7u.mongodb.net/emailDB";
const EMAIL_USER="kolaprasad001@gmail.com";
const EMAIL_PASS="lwim verx lycr vfcj"; 


mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log("MongoDB connected successfully.");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});



// Handle Email Submission
const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

// Handle Email Submission and Store in MongoDB
app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new message document
    const newMessage = new Message({
        name,
        email,
        message
    });

    try {
        // Save the message to MongoDB
        await newMessage.save();

        // Send the email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });

        const mailOptions = {
            from: email,
            to: EMAIL_USER,
            subject: `New Contact Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: "Message sent successfully and saved to MongoDB!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send message or save to MongoDB" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



