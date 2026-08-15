const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    authorize("admin"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome to the Admin Dashboard 👑",
            user: req.user
        });
    }
);

module.exports = router;