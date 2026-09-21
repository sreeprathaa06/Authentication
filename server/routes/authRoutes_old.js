const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    register,
    verifyEmail,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    registerValidation,
    loginValidation
} = require("../validators/authValidator");

const validate = require("../middleware/validationMiddleware");

const router = express.Router();


// ======================================================
// LOGIN RATE LIMITER
// ======================================================

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many login attempts. Please try again later."
    }
});


// ======================================================
// PASSWORD RESET RATE LIMITER
// ======================================================

const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many password reset requests. Please try again later."
    }
});


// ======================================================
// EMAIL VERIFICATION RATE LIMITER
// ======================================================

const emailVerificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many verification attempts. Please try again later."
    }
});


// ======================================================
// REGISTER
// ======================================================

router.post(
    "/register",
    registerValidation,
    validate,
    register
);


// ======================================================
// VERIFY EMAIL
// ======================================================

router.get(
    "/verify-email",
    emailVerificationLimiter,
    verifyEmail
);


// ======================================================
// LOGIN
// ======================================================

router.post(
    "/login",
    loginLimiter,
    loginValidation,
    validate,
    login
);


// ======================================================
// REFRESH ACCESS TOKEN
// ======================================================

router.post(
    "/refresh",
    refreshAccessToken
);


// ======================================================
// CURRENT USER
// ======================================================

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


// ======================================================
// ADMIN ONLY
// ======================================================

router.get(
    "/admin",
    protect,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome Admin! 👑",
            user: req.user
        });
    }
);


// ======================================================
// LOGOUT
// ======================================================

router.post(
    "/logout",
    logout
);


// ======================================================
// FORGOT PASSWORD
// ======================================================

router.post(
    "/forgot-password",
    passwordResetLimiter,
    forgotPassword
);


// ======================================================
// RESET PASSWORD
// ======================================================

router.post(
    "/reset-password",
    passwordResetLimiter,
    resetPassword
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;
```
