const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const PasswordResetToken = require("../models/PasswordResetToken");


// ======================================================
// HELPER: CREATE ACCESS TOKEN
// ======================================================

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );
};


// ======================================================
// HELPER: CREATE REFRESH TOKEN
// ======================================================

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};


// ======================================================
// REGISTER
// ======================================================

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

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
        console.error("Register error:", error);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};


// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create access token
        const accessToken = generateAccessToken(user);

        // Create refresh token
        const refreshToken = generateRefreshToken();

        // Hash refresh token before storing it
        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        await RefreshToken.create({
            userId: user._id,
            tokenHash: refreshTokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        // Store tokens in HTTP-only cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

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


// ======================================================
// REFRESH TOKEN
// ======================================================

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            });
        }

        const tokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        const storedToken = await RefreshToken.findOne({
            tokenHash
        });

        if (!storedToken) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        if (storedToken.revoked) {
            return res.status(401).json({
                message: "Refresh token has been revoked"
            });
        }

        if (storedToken.expiresAt < new Date()) {
            return res.status(401).json({
                message: "Refresh token has expired"
            });
        }

        const user = await User.findById(storedToken.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // Revoke old token
        storedToken.revoked = true;
        await storedToken.save();

        // Generate new tokens
        const newAccessToken = generateAccessToken(user);

        const newRefreshToken = generateRefreshToken();

        const newRefreshTokenHash = crypto
            .createHash("sha256")
            .update(newRefreshToken)
            .digest("hex");

        await RefreshToken.create({
            userId: user._id,
            tokenHash: newRefreshTokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

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

        res.status(500).json({
            message: "Server error while refreshing token"
        });
    }
};


// ======================================================
// LOGOUT
// ======================================================

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const tokenHash = crypto
                .createHash("sha256")
                .update(refreshToken)
                .digest("hex");

            await RefreshToken.findOneAndUpdate(
                { tokenHash },
                { revoked: true }
            );
        }

        res.clearCookie("accessToken");

        res.clearCookie("refreshToken");

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


// ======================================================
// FORGOT PASSWORD
// ======================================================

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        /*
         IMPORTANT SECURITY PRACTICE:

         We don't reveal whether the email exists.
         This prevents attackers from discovering registered emails.
        */

        if (!user) {
            return res.status(200).json({
                message:
                    "If an account exists with this email, a password reset link has been generated"
            });
        }

        // Remove previous reset tokens
        await PasswordResetToken.deleteMany({
            userId: user._id
        });

        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before storing
        const tokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Token expires in 15 minutes
        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await PasswordResetToken.create({
            userId: user._id,
            tokenHash,
            expiresAt
        });

        /*
         DEVELOPMENT ONLY

         In a real application, this token would be sent
         through an email service.

         We return it here temporarily so you can test
         the complete flow with Postman.
        */

        res.status(200).json({
            message:
                "If an account exists with this email, a password reset link has been generated",

            resetToken: resetToken,

            expiresIn: "15 minutes"
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        res.status(500).json({
            message: "Server error while processing password reset"
        });
    }
};


// ======================================================
// RESET PASSWORD
// ======================================================

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                message: "Token and new password are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        // Hash the token received from the user
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find stored token
        const storedToken = await PasswordResetToken.findOne({
            tokenHash
        });

        if (!storedToken) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        if (storedToken.used) {
            return res.status(400).json({
                message: "Reset token has already been used"
            });
        }

        if (storedToken.expiresAt < new Date()) {
            return res.status(400).json({
                message: "Reset token has expired"
            });
        }

        // Find user
        const user = await User.findById(
            storedToken.userId
        );

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            12
        );

        user.password = hashedPassword;

        await user.save();

        // Mark reset token as used
        storedToken.used = true;

        await storedToken.save();

        /*
         SECURITY:

         Revoke all existing refresh tokens.
         This logs the user out from existing sessions.
        */

        await RefreshToken.updateMany(
            {
                userId: user._id,
                revoked: false
            },
            {
                revoked: true
            }
        );

        // Clear cookies from current browser
        res.clearCookie("accessToken");

        res.clearCookie("refreshToken");

        res.status(200).json({
            message:
                "Password reset successful. Please login again."
        });

    } catch (error) {
        console.error("Reset password error:", error);

        res.status(500).json({
            message: "Server error while resetting password"
        });
    }
};


// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
    register,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword
};