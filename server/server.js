const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

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
        origin: process.env.CLIENT_URL || "http://localhost:3000",
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
        message: "AuthForge API is running"
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

startServer();