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

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Authentication routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Root test route
app.get("/", (req, res) => {
    res.json({
        message: "AuthForge API is running 🚀"
    });
});

// Server configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});