const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const PasswordResetToken = require("../models/PasswordResetToken");

const transporter = require("../config/mailer");


// ======================================================
// ACCESS TOKEN
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
// REFRESH TOKEN
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

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            if (existingUser.emailVerified) {
                return res.status(409).json({
                    success: false,
                    message: "User already exists"
                });
            } else {
                // If user exists but is not verified, delete the old record and let them re-register
                // This acts as a robust fail-safe if verification emails fail or expire
                await User.deleteOne({ _id: existingUser._id });
                
                try {
                    const EmailVerificationToken = require("../models/EmailVerificationToken");
                    await EmailVerificationToken.deleteMany({ user: existingUser._id });
                } catch (err) {
                    console.error("Cleanup of old tokens failed", err);
                }
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "user",
            emailVerified: false
        });


        // ==================================================
        // CREATE EMAIL VERIFICATION TOKEN
        // ==================================================

        const verificationToken =
            crypto.randomBytes(32).toString("hex");

        const verificationTokenHash =
            crypto
                .createHash("sha256")
                .update(verificationToken)
                .digest("hex");


        const EmailVerificationToken = require("../models/EmailVerificationToken");

        await EmailVerificationToken.create({
            user: user._id,
            tokenHash: verificationTokenHash,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        });


        // ==================================================
        // SEND VERIFICATION EMAIL
        // ==================================================

        const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";

        const verificationUrl =
            `${frontendUrl}/verify-email?token=${verificationToken}`;


        try {

            await transporter.sendMail({
                from:
                    process.env.EMAIL_FROM ||
                    process.env.EMAIL_USER,

                to: user.email,

                subject: "Verify your AuthForge account",

                html: `
                    <div style="font-family: Arial, sans-serif; padding: 30px;">

                        <h2>Welcome to AuthForge, ${user.name}!</h2>

                        <p>
                            Your account has been created successfully.
                        </p>

                        <p>
                            Please verify your email address by clicking
                            the button below.
                        </p>

                        <a
                            href="${verificationUrl}"
                            style="
                                display:inline-block;
                                padding:12px 20px;
                                background:#4f46e5;
                                color:white;
                                text-decoration:none;
                                border-radius:6px;
                            "
                        >
                            Verify Email
                        </a>

                        <p style="margin-top:20px;">
                            This link will expire in 15 minutes.
                        </p>

                    </div>
                `
            });

            console.log(
                "Verification email sent successfully ✅"
            );

        } catch (emailError) {

            console.error(
                "Verification email error:",
                emailError.message
            );

            // Rollback: delete the user and token if the email fails to send
            await User.deleteOne({ _id: user._id });
            if (typeof EmailVerificationToken !== 'undefined') {
                 await EmailVerificationToken.deleteOne({ user: user._id });
            }

            return res.status(500).json({
            success: false,
            message:
                    "Server error: Could not send verification email. Please try again."
            });
        }


        res.status(201).json({
            success: true,
            message:
                "Registration successful. Please check your email to verify your account.",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified
            }
        });

    } catch (error) {

        const fs = require('fs');
        fs.writeFileSync('server_error.log', 'Register error:\n' + (error.stack || error));
        console.error("Register error:", error.stack || error);

        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};


// ======================================================
// VERIFY EMAIL
// ======================================================

const verifyEmail = async (req, res) => {
    try {

        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
            success: false,
            message: "Verification token is required"
            });
        }


        const tokenHash =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");


        const EmailVerificationToken = require("../models/EmailVerificationToken");

        const storedToken = await EmailVerificationToken.findOne({
            tokenHash,
            expiresAt: {
                $gt: new Date()
            }
        });

        if (!storedToken) {
            return res.status(400).json({
            success: false,
            message: "Invalid or expired verification token"
            });
        }


        const user = await User.findById(storedToken.user);

        if (!user) {
            return res.status(400).json({
            success: false,
            message: "User not found"
            });
        }


        user.emailVerified = true;
        await user.save();

        await EmailVerificationToken.deleteOne({ _id: storedToken._id });


        res.status(200).json({
            success: true,
            message:
                "Email verified successfully. You can now login."
        });

    } catch (error) {

        console.error(
            "Email verification error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error during email verification"
        });
    }
};


// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase()
        });


        if (!user) {
            return res.status(401).json({
            success: false,
            message: "Invalid email or password"
            });
        }


        if (!user.emailVerified) {
            return res.status(403).json({
            success: false,
            message:
                    "Please verify your email before logging in"
            });
        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {
            return res.status(401).json({
            success: false,
            message: "Invalid email or password"
            });
        }


        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken();


        const refreshTokenHash =
            crypto
                .createHash("sha256")
                .update(refreshToken)
                .digest("hex");


        await RefreshToken.create({
            userId: user._id,
            tokenHash: refreshTokenHash,
            expiresAt:
                new Date(
                    Date.now() +
                    7 * 24 * 60 * 60 * 1000
                )
        });


        res.cookie(
            "accessToken",
            accessToken,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000
            }
        );


        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge:
                    7 * 24 * 60 * 60 * 1000
            }
        );


        res.status(200).json({
            success: true,
            message: "Login successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified
            }
        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};


// ======================================================
// REFRESH ACCESS TOKEN
// ======================================================

const refreshAccessToken = async (req, res) => {
    try {

        const refreshToken =
            req.cookies.refreshToken;


        if (!refreshToken) {
            return res.status(401).json({
            success: false,
            message: "Refresh token not found"
            });
        }


        const tokenHash =
            crypto
                .createHash("sha256")
                .update(refreshToken)
                .digest("hex");


        const storedToken =
            await RefreshToken.findOne({
                tokenHash
            });


        if (!storedToken) {
            return res.status(401).json({
            success: false,
            message: "Invalid refresh token"
            });
        }


        if (storedToken.revoked) {
            // Token reuse detected - revoke all tokens for this user
            await RefreshToken.updateMany(
                { userId: storedToken.userId },
                { revoked: true }
            );
            return res.status(401).json({
            success: false,
            message: "Refresh token reuse detected. All sessions revoked for security."
            });
        }


        if (storedToken.expiresAt < new Date()) {
            return res.status(401).json({
            success: false,
            message:
                    "Refresh token has expired"
            });
        }


        const user =
            await User.findById(
                storedToken.userId
            );


        if (!user) {
            return res.status(401).json({
            success: false,
            message: "User not found"
            });
        }


        storedToken.revoked = true;

        await storedToken.save();


        const newAccessToken =
            generateAccessToken(user);

        const newRefreshToken =
            generateRefreshToken();


        const newRefreshTokenHash =
            crypto
                .createHash("sha256")
                .update(newRefreshToken)
                .digest("hex");


        await RefreshToken.create({
            userId: user._id,
            tokenHash: newRefreshTokenHash,
            expiresAt:
                new Date(
                    Date.now() +
                    7 * 24 * 60 * 60 * 1000
                )
        });


        res.cookie(
            "accessToken",
            newAccessToken,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000
            }
        );


        res.cookie(
            "refreshToken",
            newRefreshToken,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge:
                    7 * 24 * 60 * 60 * 1000
            }
        );


        res.status(200).json({
            success: true,
            message:
                "Tokens refreshed successfully"
        });

    } catch (error) {

        console.error(
            "Refresh token error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while refreshing token"
        });
    }
};


// ======================================================
// LOGOUT
// ======================================================

const logout = async (req, res) => {
    try {

        const refreshToken =
            req.cookies.refreshToken;


        if (refreshToken) {

            const tokenHash =
                crypto
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
            success: true,
            message: "Logout successful"
        });

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error during logout"
        });
    }
};


// ======================================================
// FORGOT PASSWORD
// ======================================================

const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        const user =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (!user) {
            return res.status(200).json({
            success: true,
            message:
                    "If an account exists with this email, a password reset link has been generated"
            });
        }


        await PasswordResetToken.deleteMany({
            userId: user._id
        });


        const resetToken =
            crypto.randomBytes(32).toString("hex");


        const tokenHash =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");


        await PasswordResetToken.create({
            userId: user._id,
            tokenHash,
            expiresAt:
                new Date(
                    Date.now() +
                    15 * 60 * 1000
                )
        });


        const frontendUrl = process.env.FRONTEND_URL;
        const resetLink = frontendUrl 
            ? `${frontendUrl}/reset-password?token=${resetToken}`
            : `Token for POST /api/auth/reset-password: ${resetToken}`;

        try {
            await transporter.sendMail({
                from:
                    process.env.EMAIL_FROM ||
                    process.env.EMAIL_USER,
                to: user.email,
                subject: "Reset your AuthForge password",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 30px;">
                        <h2>Password Reset Request</h2>
                        <p>We received a request to reset your password.</p>
                        <p>Use the following link or token to reset your password:</p>
                        <p><strong>${resetLink}</strong></p>
                        <p style="margin-top:20px;">This token will expire in 15 minutes.</p>
                    </div>
                `
            });
            console.log("Password reset email sent successfully ✅");
        } catch (emailError) {
            console.error("Password reset email error:", emailError.message);
        }

        res.status(200).json({
            success: true,
            message:
                "If an account exists with this email, a password reset link has been generated"
        });

    } catch (error) {

        console.error(
            "Forgot password error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while processing password reset"
        });
    }
};


// ======================================================
// RESET PASSWORD
// ======================================================

const resetPassword = async (req, res) => {
    try {

        const {
            token,
            newPassword
        } = req.body;

        const tokenHash =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");


        const storedToken =
            await PasswordResetToken.findOne({
                tokenHash
            });


        if (!storedToken) {
            return res.status(400).json({
            success: false,
            message:
                    "Invalid or expired reset token"
            });
        }


        if (storedToken.used) {
            return res.status(400).json({
            success: false,
            message:
                    "Reset token has already been used"
            });
        }


        if (storedToken.expiresAt < new Date()) {
            return res.status(400).json({
            success: false,
            message:
                    "Reset token has expired"
            });
        }


        const user =
            await User.findById(
                storedToken.userId
            );


        if (!user) {
            return res.status(400).json({
            success: false,
            message: "User not found"
            });
        }


        user.password =
            await bcrypt.hash(
                newPassword,
                12
            );


        await user.save();


        storedToken.used = true;

        await storedToken.save();


        await RefreshToken.updateMany(
            {
                userId: user._id,
                revoked: false
            },
            {
                revoked: true
            }
        );


        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");


        res.status(200).json({
            success: true,
            message:
                "Password reset successful. Please login again."
        });

    } catch (error) {

        console.error(
            "Reset password error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Server error while resetting password"
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    register,
    verifyEmail,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword
};