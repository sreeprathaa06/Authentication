const jwt = require("jsonwebtoken");

// Create short-lived access token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );
};

// Create long-lived refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
            type: "refresh"
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};