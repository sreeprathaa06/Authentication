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


// ======================================================
// LOAD ENVIRONMENT VARIABLES
// ======================================================

dotenv.config();


// ======================================================
// CREATE EXPRESS APP
// ======================================================

const app = express();


// ======================================================
// SECURITY HEADERS
// ======================================================

app.use(
    helmet({
        contentSecurityPolicy: false
    })
);


// ======================================================
// CORS CONFIGURATION
// ======================================================

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173"
];

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests without an origin
            // such as Postman
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },

        credentials: true
    })
);


// ======================================================
// BODY PARSER
// ======================================================

app.use(
    express.json({
        limit: "10kb"
    })
);


// ======================================================
// COOKIE PARSER
// ======================================================

app.use(cookieParser());


// ======================================================
// CONNECT DATABASE
// ======================================================

connectDB();


// ======================================================
// AUTHENTICATION ROUTES
// ======================================================

app.use(
    "/api/auth",
    authRoutes
);


// ======================================================
// ROOT ROUTE
// ======================================================

app.get("/", (req, res) => {

    res.status(200).json({
        message: "AuthForge API is running 🚀",
        status: "healthy"
    });

});


// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });

});


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {

    console.error("Server error:", err.message);

    if (err.message === "Not allowed by CORS") {

        return res.status(403).json({
            message: "CORS policy blocked this request"
        });

    }

    res.status(500).json({
        message: "Internal server error"
    });

});


// ======================================================
// SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});