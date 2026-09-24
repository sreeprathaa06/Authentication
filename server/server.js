const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();


// ======================================================
// SECURITY
// ======================================================

app.use(helmet());


// ======================================================
// CORS
// ======================================================

app.use(
    cors({
        origin: function (origin, callback) {
            callback(null, true); // Allow all origins for local development
        },
        credentials: true
    })
);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ======================================================
// ROOT ROUTE
// ======================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AuthForge API is running"
    });
});


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    res.status(200).json({
        success: true,
        message: "API is running smoothly",
        environment: process.env.NODE_ENV || "development",
        database: dbStatus
    });
});


// ======================================================
// AUTH ROUTES
// ======================================================

app.use("/api/auth", authRoutes);


// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl
    });
});


// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
    console.error("Server error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});


// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {

        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error(
            "Failed to start server:",
            error.message
        );

        process.exit(1);
    }
};
if (process.env.NODE_ENV !== "test") {
    startServer();
}

module.exports = app;