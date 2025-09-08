require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const cors = require("cors");
const app = express();
app.use(bodyParser.json());


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        "https://luther-tech-health.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// POST /send-email
app.post("/send-email", async (req, res) => {
  const { to, subject, text, html } = req.body;
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({
      error: "Missing required fields: to, subject, and either text or html",
    });
  }

  // Configure Brevo SMTP with environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: parseInt(process.env.BREVO_SMTP_PORT, 10),
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug: true, // Enable debug logs
    logger: true, // Enable logger
  });

  // Verify SMTP connection
  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully");
  } catch (error) {
    console.error("SMTP connection failed:", error);
    return res
      .status(500)
      .json({ error: "SMTP connection failed: " + error.message });
  }

  try {
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME,
        address: process.env.EMAIL_FROM_ADDRESS,
      },
      to,
      subject,
      text,
      html,
    };

    console.log("Sending email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);

    res.json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Email API is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Email API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Send email: POST http://localhost:${PORT}/send-email`);
});
