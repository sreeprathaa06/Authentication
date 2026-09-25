const fs = require('fs');
let content = fs.readFileSync('routes/authRoutes.js', 'utf8');

const regex = /router\.get\(\s*"\/me",\s*protect,\s*\(req, res\) => \{\s*res\.status\(200\)\.json\(\{\s*success: true,\s*message: "You are authenticated",\s*user: req\.user\s*\}\);\s*\}\s*\);/g;

const replacement = `router.get(
    "/me",
    protect,
    async (req, res) => {
        try {
            const User = require("../models/User");
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ success: false, message: "User not found" });
            res.status(200).json({
                success: true,
                message: "You are authenticated",
                user: { id: user._id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Server error" });
        }
    }
);`;

content = content.replace(regex, replacement);
fs.writeFileSync('routes/authRoutes.js', content);
console.log("Replaced successfully!");
