const express = require("express");

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
    loginValidation,
    validate,
    login
);

// Current user
router.get(
    "/me",
    protect,
    async (req, res) => {
        res.status(200).json({
            message: "You are authenticated",
            user: req.user
        });
    }
);

// Logout
router.post("/logout", logout);

module.exports = router;