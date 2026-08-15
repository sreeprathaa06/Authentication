const dns = require("dns");

// Fix MongoDB SRV DNS resolution
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);

// Body parsing middleware
app.use(express.json());

// Cookie parsing middleware
app.use(cookieParser());

// Authentication routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Root test route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "AuthForge API is running 🚀"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Error:", err.stack);

    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});

// Server configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});