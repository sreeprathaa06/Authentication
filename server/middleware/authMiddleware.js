const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {

        // ==================================================
        // GET ACCESS TOKEN FROM COOKIE
        // ==================================================

        let accessToken = req.cookies.accessToken;


        // ==================================================
        // GET ACCESS TOKEN FROM AUTHORIZATION HEADER
        // ==================================================

        if (!accessToken) {

            const authHeader = req.headers.authorization;

            if (
                authHeader &&
                authHeader.startsWith("Bearer ")
            ) {
                accessToken = authHeader.split(" ")[1];
            }
        }


        // ==================================================
        // CHECK WHETHER TOKEN EXISTS
        // ==================================================

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Access token not found"
            });
        }


        // ==================================================
        // VERIFY JWT
        // ==================================================

        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_SECRET
        );


        // ==================================================
        // ATTACH USER INFORMATION
        // ==================================================

        req.user = decoded;


        // ==================================================
        // CONTINUE REQUEST
        // ==================================================

        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token"
        });
    }
};


module.exports = protect;