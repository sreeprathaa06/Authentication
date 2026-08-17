const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    register,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

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
// REGISTER
// ======================================================

router.post(
    "/register",
    registerValidation,
    validate,
    register
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
// CURRENT AUTHENTICATED USER
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