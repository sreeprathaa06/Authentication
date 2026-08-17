const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                message: "Access token not found"
            });
        }

        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token"
        });
    }
};

module.exports = protect;