const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Protected route
router.get("/me", protect, async (req, res) => {
    res.status(200).json({
        message: "You are authenticated",
        user: req.user
    });
});

module.exports = router;