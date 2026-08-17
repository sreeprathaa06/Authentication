const dns = require("dns");

// Fix MongoDB Atlas SRV DNS resolution
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Import database connection AFTER DNS configuration
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");

const app = express();


// =========================
// DATABASE
// =========================

connectDB();


// =========================
// MIDDLEWARE
// =========================

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());


// =========================
// ROUTES
// =========================

// Authentication routes
app.use("/api/auth", authRoutes);


// =========================
// ROOT ROUTE
// =========================

app.get("/", (req, res) => {
    res.status(200).json({
        message: "AuthForge API is running 🚀"
    });
});


// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
    console.error("Server error:", err);

    res.status(500).json({
        message: "Internal server error"
    });
});


// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});