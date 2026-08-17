const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

const {
    generateAccessToken,
    generateRefreshToken,
    hashToken
} = require("../utils/tokenUtils");


// =========================
// REGISTER
// =========================

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};


// =========================
// LOGIN
// =========================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store only the hash in MongoDB
        const tokenHash = hashToken(refreshToken);

        await RefreshToken.create({
            userId: user._id,
            tokenHash,
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        });

        // Access token cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        // Refresh token cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error during login"
        });
    }
};


// =========================
// REFRESH ACCESS TOKEN
// =========================

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        if (decoded.type !== "refresh") {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        // Hash incoming token
        const tokenHash = hashToken(refreshToken);

        // Find active token session
        const storedToken = await RefreshToken.findOne({
            tokenHash,
            revoked: false
        });

        if (!storedToken) {
            return res.status(401).json({
                message: "Refresh token has been revoked or is invalid"
            });
        }

        // Check expiry
        if (storedToken.expiresAt < new Date()) {
            storedToken.revoked = true;
            await storedToken.save();

            return res.status(401).json({
                message: "Refresh token has expired"
            });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists"
            });
        }

        // Revoke old refresh token
        storedToken.revoked = true;
        await storedToken.save();

        // Generate new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Store new refresh token hash
        const newTokenHash = hashToken(newRefreshToken);

        await RefreshToken.create({
            userId: user._id,
            tokenHash: newTokenHash,
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        });

        // Set new access token
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        // Set new refresh token
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Tokens refreshed successfully"
        });

    } catch (error) {
        console.error("Refresh token error:", error);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
};


// =========================
// LOGOUT
// =========================

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        // Revoke refresh token in database
        if (refreshToken) {
            const tokenHash = hashToken(refreshToken);

            await RefreshToken.findOneAndUpdate(
                {
                    tokenHash
                },
                {
                    revoked: true
                }
            );
        }

        // Clear cookies
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        console.error("Logout error:", error);

        res.status(500).json({
            message: "Server error during logout"
        });
    }
};


module.exports = {
    register,
    login,
    refreshAccessToken,
    logout
};