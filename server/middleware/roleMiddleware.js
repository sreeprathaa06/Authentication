// ======================================================
// ROLE-BASED AUTHORIZATION MIDDLEWARE
// ======================================================

const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        // ==================================================
        // CHECK AUTHENTICATION
        // ==================================================

        // authMiddleware must run before this middleware.
        // It attaches the authenticated user to req.user.

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }


        // ==================================================
        // CHECK USER ROLE
        // ==================================================

        if (!req.user.role) {
            return res.status(403).json({
                success: false,
                message: "User role is not defined"
            });
        }


        // ==================================================
        // CHECK ALLOWED ROLES
        // ==================================================

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not have permission."
            });
        }


        // ==================================================
        // AUTHORIZATION SUCCESSFUL
        // ==================================================

        next();
    };
};


// ======================================================
// EXPORT MIDDLEWARE
// ======================================================

module.exports = authorizeRoles;