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
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation
} = require("../validators/authValidator");

const validate = require("../middleware/validationMiddleware");

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many login attempts. Please try again later."
    }
});

const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many password reset requests. Please try again later."
    }
});

const emailVerificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many verification attempts. Please try again later."
    }
});

router.post(
    "/register",
    registerValidation,
    validate,
    register
);

router.get(
    "/verify-email",
    emailVerificationLimiter,
    verifyEmail
);

router.post(
    "/login",
    loginLimiter,
    loginValidation,
    validate,
    login
);

router.post(
    "/refresh",
    refreshAccessToken
);

router.get(
    "/me",
    protect,
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "You are authenticated",
            user: req.user
        });
    }
);

router.get(
    "/admin",
    protect,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Admin",
            user: req.user
        });
    }
);

router.post(
    "/logout",
    logout
);

router.post(
    "/forgot-password",
    passwordResetLimiter,
    forgotPasswordValidation,
    validate,
    forgotPassword
);

router.post(
    "/reset-password",
    passwordResetLimiter,
    resetPasswordValidation,
    validate,
    resetPassword
);

module.exports = router;