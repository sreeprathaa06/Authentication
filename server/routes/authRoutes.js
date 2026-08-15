const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    register,
    login,
    logout
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const {
    registerValidation,
    loginValidation
} = require("../validators/authValidator");

const validate = require("../middleware/validationMiddleware");

const router = express.Router();

// Login rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many login attempts. Please try again later."
    }
});

// Register
router.post(
    "/register",
    registerValidation,
    validate,
    register
);

// Login
router.post(
    "/login",
    loginLimiter,
    loginValidation,
    validate,
    login
);

// Current authenticated user
router.get(
    "/me",
    protect,
    (req, res) => {
        res.status(200).json({
            message: "You are authenticated",
            user: req.user
        });
    }
);

// Logout
router.post(
    "/logout",
    logout
);

module.exports = router;